from typing import Annotated, Optional
import uuid
import os
from datetime import timedelta, timezone, datetime
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Response, Request, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status
from passlib.context import CryptContext
from jose import jwt, JWTError
import uvicorn
from dotenv import load_dotenv
from database import Session, User, RefreshToken
from sqlalchemy.orm import Session as SASession


app = FastAPI()

#Creating allowed origins to access the website.
origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://www.echosofink.ca",
    "https://www.echosofink.ca",
    "https://echosofink.ca",
    "http://echosofink.ca"
]


#Implementing CORS to handle the FastAPI requests and responses.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

load_dotenv(dotenv_path=Path(__file__).with_name('.env'))


def hashPassword(plainPassword: str) -> str:
    return bcrypt_context.hash(plainPassword)


def verifyPassword(plainPassword: str, hashedPassword: str) -> bool:
    return bcrypt_context.verify(plainPassword, hashedPassword)

#Establishing a connection to the database.
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not set. Define it in backend/.env or the environment.")

ALGORITHM = "HS256"
IS_PROD = os.getenv("APP_ENV") == "prod"

# Access Cookie
ACCESS_TTL = timedelta(minutes=15)
ACCESS_COOKIE_NAME = 'at'
ACCESS_COOKIE_SECURE = IS_PROD
ACCESS_COOKIE_DOMAIN = "echosofink.ca" if IS_PROD else None
ACCESS_COOKIE_SAMESITE = 'None' if IS_PROD else "Lax"
ACCESS_COOKIE_PATH = '/api'

# Refresh Cookie
REFRESH_TTL = timedelta(days=30)
REFRESH_COOKIE_NAME = 'rt'
REFRESH_COOKIE_SECURE = IS_PROD
REFRESH_COOKIE_DOMAIN = "echosofink.ca" if IS_PROD else None
REFRESH_COOKIE_SAMESITE = 'None' if IS_PROD else "Lax"
REFRESH_COOKIE_PATH = '/api/auth'

#Helper methods
def now_ts() -> int:
    return int(datetime.now(timezone.utc).timestamp())


def now_dt() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(username: str) -> str:
    token = {
        "sub": username,
        "type": "access",
        "iat": now_ts(),
        'exp': now_ts() + int(ACCESS_TTL.total_seconds())
    }
    return jwt.encode(token, SECRET_KEY, ALGORITHM)


def create_refresh_token(username: str):
    jti = str(uuid.uuid4())
    token = {
        "sub": username,
        "type": "refresh",
        "jti": jti,
        "iat": now_ts(),
        "exp": now_ts() + int(REFRESH_TTL.total_seconds())
    }
    return jwt.encode(token, SECRET_KEY, ALGORITHM), jti


def set_access_cookie(response: Response, token: str):
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite=ACCESS_COOKIE_SAMESITE,
        domain=ACCESS_COOKIE_DOMAIN,
        secure=ACCESS_COOKIE_SECURE,
        max_age=int(ACCESS_TTL.total_seconds()),
        path=ACCESS_COOKIE_PATH,
    )


def clear_access_cookie(response: Response):
    response.delete_cookie(
        key=ACCESS_COOKIE_NAME,
        domain=ACCESS_COOKIE_DOMAIN,
        path=ACCESS_COOKIE_PATH,
    )


def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite=REFRESH_COOKIE_SAMESITE,
        domain=REFRESH_COOKIE_DOMAIN,
        secure=REFRESH_COOKIE_SECURE,
        max_age=int(REFRESH_TTL.total_seconds()),
        path=REFRESH_COOKIE_PATH,
    )


def clear_refresh_cookie(response: Response):
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        domain=REFRESH_COOKIE_DOMAIN,
        path=REFRESH_COOKIE_PATH,
    )


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def decode_dependency(request: Request, db: SASession = Depends(get_db)):
    cred_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Access Token is Invalid",
        headers={"WWW-Authenticate": "Bearer"}
    )

    token = request.cookies.get(ACCESS_COOKIE_NAME)
    if not token:
        raise cred_error

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise cred_error
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if not username or not user:
            raise cred_error

        return user

    except JWTError:
        raise cred_error


#Extra layer of security to only allow the trusted origins to make requests to the server in production.
TRUSTED_ORIGINS = set(origins)

def _request_origin(request: Request) -> Optional[str]:
    origin = request.headers.get("origin")
    return origin.rstrip("/") if origin else None


def assert_trusted_origin(request: Request) -> None:
    if not IS_PROD:
        return
    origin = _request_origin(request)
    if origin and origin not in TRUSTED_ORIGINS:
        raise HTTPException(status_code=403, detail="Untrusted origin")

#Assigning a refresh token to the user in the database.
def _persist_refresh_token(db: SASession, user: User, jti: str):
    expires_at = now_dt() + REFRESH_TTL
    token_row = db.query(RefreshToken).filter(RefreshToken.user_id == user.id).first()
    if token_row:
        token_row.jti = jti
        token_row.expires_at = expires_at
        token_row.revoked = False
    else:
        db.add(RefreshToken(jti=jti, user_id=user.id, expires_at=expires_at, revoked=False))
    db.commit()

#Revoking/removing the refresh token of the user in the database.
def _revoke_refresh_token(db: SASession, user_id: int):
    token_row = db.query(RefreshToken).filter(RefreshToken.user_id == user_id).first()
    if token_row:
        db.delete(token_row)
        db.commit()


@app.post('/token')
def login(response: Response, userInfo: Annotated[OAuth2PasswordRequestForm, Depends()], db: SASession = Depends(get_db)):
    user = db.query(User).filter(User.username == userInfo.username).first()
    if not user or not verifyPassword(userInfo.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    accessToken = create_access_token(userInfo.username)
    refreshToken, jti = create_refresh_token(userInfo.username)
    _persist_refresh_token(db, user, jti)
    set_access_cookie(response, accessToken)
    set_refresh_cookie(response, refreshToken)
    return {
        "access_token": accessToken,
        "type": "bearer",
        "expiresIn": int(ACCESS_TTL.total_seconds())
    }


@app.post('/refresh')
def refresh(request: Request, response: Response, rt_cookie: Optional[str] = Cookie(default=None, alias=REFRESH_COOKIE_NAME), db: SASession = Depends(get_db)):
    assert_trusted_origin(request)
    if not rt_cookie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Refresh Cookie"
        )
    try:
        payload = decode_token(rt_cookie)
    except JWTError:
        clear_refresh_cookie(response)
        clear_access_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Refresh Cookie"
        )
    if payload.get("type") != 'refresh':
        clear_refresh_cookie(response)
        clear_access_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Refresh Cookie"
        )

    username = payload.get("sub")
    jti = payload.get("jti")

    user = db.query(User).filter(User.username == username).first()
    if not username or not jti or not user:
        clear_refresh_cookie(response)
        clear_access_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Refresh Cookie"
        )

    token_row = db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.jti == jti,
        RefreshToken.revoked == False,  # noqa: E712
        RefreshToken.expires_at > now_dt()
    ).first()

    if not token_row:
        clear_refresh_cookie(response)
        clear_access_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh Token expired please login again!"
        )

    # rotate refresh token
    new_rt_token, new_jti = create_refresh_token(username)
    _persist_refresh_token(db, user, new_jti)
    access_token = create_access_token(username)

    set_refresh_cookie(response, new_rt_token)
    set_access_cookie(response, access_token)

    return {
        "access_token": access_token,
        "type": "bearer",
        "expiresIn": int(ACCESS_TTL.total_seconds())
    }


@app.post("/logout")
def logout(request: Request, response: Response, rt_cookie=Cookie(default=None, alias=REFRESH_COOKIE_NAME), db: SASession = Depends(get_db)):
    assert_trusted_origin(request)
    if rt_cookie:
        try:
            payload = decode_token(rt_cookie)
            if payload.get("sub") and payload.get("type") == "refresh":
                user = db.query(User).filter(User.username == payload.get("sub")).first()
                if user:
                    _revoke_refresh_token(db, user.id)
        except JWTError:
            pass
    clear_refresh_cookie(response)
    clear_access_cookie(response)
    return {"ok": True}

#Get current user
@app.get("/user/me")
def read_users_me(currentUser: Annotated[User, Depends(decode_dependency)]):
    return currentUser


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

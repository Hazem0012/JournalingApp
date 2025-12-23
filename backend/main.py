from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from sqlalchemy.orm import Session as SASession
from starlette import status
import uvicorn
from auth import decode_dependency, hashPassword
from auth import app as auth_app
from database import Session, User, Journal


app = FastAPI()

app.mount("/auth", auth_app)

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


class CreateUser(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    password: str

    #Backend validator against empty fields.
    @field_validator("firstName", "lastName", "username", "password", mode="before")
    @classmethod
    def _no_blank(cls, v: str) -> str:
        if v is None:
            raise ValueError("No empty values are allowed.")
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("No empty values are allowed.")
        return v


class ReadUser(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: EmailStr
    username: str

    model_config = ConfigDict(from_attributes=True)


class UpdateUser(BaseModel):
    firstName: Optional[str]
    lastName: Optional[str]
    email: Optional[EmailStr]


class CreateJournal(BaseModel):
    title: str
    description: str
    created_at: datetime | None = None
    updated_at:datetime | None = None


class ReadJournal(BaseModel):
    id: int
    title: str
    description: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UpdateJournal(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    updated_at:datetime


# User
@app.get("/users", response_model=ReadUser)
def getUserInfo(db: SASession = Depends(get_db), current_user: User = Depends(decode_dependency)):
    user = db.get(User, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User Not Found",
        )

    return user


@app.post("/users", response_model=ReadUser)
def create_user(payload: CreateUser, db: SASession = Depends(get_db)):
    email = db.query(User).filter(User.email == payload.email).first()
    if email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email Already Exists.",
        )

    username = db.query(User).filter(User.username == payload.username).first()
    if username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username Already Exists.",
        )

    user = User(
        firstName=payload.firstName,
        lastName=payload.lastName,
        email=str(payload.email),
        username=payload.username,
        password=hashPassword(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@app.put("/users", response_model=ReadUser)
def update_user(payload: UpdateUser, db: SASession = Depends(get_db), current_user: User = Depends(decode_dependency)):
    user = db.get(User, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User Not Found",
        )
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@app.delete("/users")
def delete_user(db: SASession = Depends(get_db), current_user: User = Depends(decode_dependency)):
    user = db.get(User, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User Not Found",
        )

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# Journal
def _get_owned_journal(journal_id: int, current_user: User, db: SASession) -> Journal:
    journal = db.get(Journal, journal_id)
    if not journal or journal.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal Not Found",
        )
    return journal


@app.get("/journals/{journal_id}", response_model=ReadJournal)
def get_journals(
    journal_id: int,
    current_user: User = Depends(decode_dependency),
    db: SASession = Depends(get_db),
):
    return _get_owned_journal(journal_id, current_user, db)


@app.get("/journals", response_model=List[ReadJournal])
def get_All_Journals(current_user: User = Depends(decode_dependency), db: SASession = Depends(get_db)):
    return db.query(Journal).filter(Journal.user_id == current_user.id).all()


@app.post("/journals", response_model=ReadJournal)
def create_journal(payload: CreateJournal, db: SASession = Depends(get_db), current_user: User = Depends(decode_dependency)):
    journal = Journal(
        title=payload.title,
        description=payload.description,
        user_id=current_user.id,
        created_at=payload.created_at,
        updated_at=payload.updated_at,
    )
    db.add(journal)
    db.commit()
    db.refresh(journal)

    return journal


@app.put("/journals/{journal_id}", response_model=ReadJournal)
def update_journal(
    journal_id: int,
    payload: UpdateJournal,
    current_user: User = Depends(decode_dependency),
    db: SASession = Depends(get_db),
):
    journal = _get_owned_journal(journal_id, current_user, db)
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(journal, key, value)
    db.commit()
    db.refresh(journal)

    return journal


@app.delete("/journals/{journal_id}")
def delete_journal(
    journal_id: int,
    current_user: User = Depends(decode_dependency),
    db: SASession = Depends(get_db),
):
    journal = _get_owned_journal(journal_id, current_user, db)
    db.delete(journal)
    db.commit()
    return {"message": f"Journal {journal_id} has been deleted"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

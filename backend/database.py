from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, create_engine, func
from sqlalchemy.orm import Mapped, MappedColumn, declarative_base, relationship, sessionmaker
from typing import List, Optional
import os
from dotenv import load_dotenv
load_dotenv()

#Loading the database URL from .env
DATABASE = os.getenv("DATABASE")

#In case of the URL absence load the parameters from .env 
if not DATABASE:
    db_name = os.getenv("POSTGRES_DB", "postgres")
    db_user = os.getenv("POSTGRES_USER", "postgres")
    db_pass = os.getenv("POSTGRES_PASSWORD", "")
    db_host = os.getenv("DB_HOST", os.getenv("POSTGRES_HOST", "localhost"))
    db_port = os.getenv("DB_PORT", "5432")
    DATABASE = f"postgresql+psycopg2://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"


#creating a connection factory to establish connections to the database
engine = create_engine(DATABASE, echo=False, future=True)

#Allowing for ORM model through Base
Base = declarative_base()

#User Table
class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = MappedColumn(primary_key=True, autoincrement=True)
    firstName: Mapped[str] = MappedColumn(nullable=False)
    lastName: Mapped[str] = MappedColumn(nullable=False)
    email: Mapped[str] = MappedColumn(unique=True, nullable=False)
    username: Mapped[str] = MappedColumn(unique=True, nullable=False)
    password: Mapped[str] = MappedColumn(nullable=False)

    journals: Mapped[List['Journal']] = relationship(
        'Journal', back_populates='user', cascade='all, delete-orphan'
    )
    refresh_token: Mapped[Optional['RefreshToken']] = relationship(
        'RefreshToken',
        back_populates='user',
        cascade='all, delete-orphan',
        uselist=False
    )

#Journal Table
class Journal(Base):
    __tablename__ = 'journal'

    id: Mapped[int] = MappedColumn(primary_key=True, autoincrement=True)
    title: Mapped[str] = MappedColumn()
    description: Mapped[str] = MappedColumn()
    user_id: Mapped[int] = MappedColumn(ForeignKey('user.id'))
    created_at: Mapped[datetime] = MappedColumn(DateTime(timezone=True))
    updated_at:Mapped[datetime]= MappedColumn(DateTime(timezone=True))

    user: Mapped['User'] = relationship('User', back_populates='journals')

#Refresh Token Table
class RefreshToken(Base):
    __tablename__ = 'refresh_token'

    id: Mapped[int] = MappedColumn(primary_key=True, autoincrement=True)
    jti: Mapped[str] = MappedColumn(String(64), unique=True, nullable=False)
    user_id: Mapped[int] = MappedColumn(ForeignKey('user.id'), nullable=False, unique = True)
    expires_at: Mapped[datetime] = MappedColumn(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = MappedColumn(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = MappedColumn(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped['User'] = relationship('User', back_populates='refresh_token')

#Creating the tables in the database following their respective metadata.
Base.metadata.create_all(engine)

#Creating a session to allow for connections to the database. Each Session object will establish a connection to the database specified in engine.
Session = sessionmaker(bind=engine, future=True)


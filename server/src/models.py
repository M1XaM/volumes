from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    user_data = relationship("UserData", back_populates="owner", uselist=False)

class UserData(Base):
    __tablename__ = "user_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    marks = Column(Text, default="{}") # JSON string
    read_list = Column(Text, default="[]") # JSON string

    owner = relationship("User", back_populates="user_data")

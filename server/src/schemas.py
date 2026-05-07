from pydantic import BaseModel
from typing import Optional, Any, Dict, List

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserDataSchema(BaseModel):
    marks: Dict[str, Any]
    read_list: List[Any]

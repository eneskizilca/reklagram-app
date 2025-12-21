# backend/app/schemas/message.py

from pydantic import BaseModel, Field, computed_field
from datetime import datetime


class MessageCreate(BaseModel):
    """Schema for creating a new message"""
    receiver_id: int = Field(..., description="ID of the message receiver")
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")

    class Config:
        from_attributes = True


class MessageOut(BaseModel):
    """Schema for message output with formatted timestamp"""
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    is_read: bool

    class Config:
        from_attributes = True

    @computed_field
    @property
    def formatted_timestamp(self) -> str:
        """Format timestamp as ISO format string"""
        return self.timestamp.isoformat()


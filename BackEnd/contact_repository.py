from base_db_class import db_class
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text
from pydantic import BaseModel

class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class contact_repo(db_class):
    Base = declarative_base()

    class Contact(Base):
        __tablename__ = "contact"

        contact_id = Column(Integer, primary_key=True, autoincrement=True)
        conatact_name = Column(String(100), nullable=False)
        conatact_email = Column(String(120), nullable=False)
        conatact_subject = Column(String(100), nullable=False)
        contact_message = Column(Text)

    def save_contact(self,a:ContactCreate):
        session = self.Session()
        try:
            new_contact = self.Contact(
                conatact_name=a.name,
                conatact_email=a.email,
                conatact_subject=a.subject,
                contact_message=a.message,
            )
            session.add(new_contact)
            session.commit()
            session.refresh(new_contact)
            return {"message": "Contact saved", "contact_id": new_contact.contact_id}
        except Exception as e:
            session.rollback()
            print(e)
            return {"error": str(e)}
        finally:
            session.close()
# repositories/states_repository.py

from base_db_class import db_class
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

class states_repo(db_class):
    Base = declarative_base()

    class States(Base):
        __tablename__ = "states"
        state_id = Column(Integer, primary_key=True, autoincrement=True)
        statename = Column(String(50), nullable=False, unique=True)

    def get_all_states(self):
        session = self.Session()
        try:
            all_states = session.query(self.States).order_by(self.States.statename).all()
            return [
                {"state_id": s.state_id, "statename": s.statename}
                for s in all_states
            ]
        finally:
            session.close()

    def get_state_name_by_id(self, state_id: int) -> str | None:
        session = self.Session()
        try:
            state = session.query(self.States).filter_by(state_id=state_id).first()
            return state.statename if state else None
        finally:
            session.close()



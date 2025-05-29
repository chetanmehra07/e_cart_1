from base_db_class import db_class
from sqlalchemy.orm import declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
)


class policy_repo(db_class):
    Base = declarative_base()

    class policy(Base):
        __tablename__ = "policy"
        policy_id = Column(Integer, primary_key=True, autoincrement=True)
        policy_name = Column(String(100), nullable=False)
        policy_discription = Column(String(100), nullable=False)

    def getdata(self, policy_id):
        session = self.Session()
        try:
            item = session.query(self.policy).filter_by(policy_id=policy_id).first()
            if item:
                item_dict = {
                    "policy_id": item.policy_id,
                    "policy_name": item.policy_name,
                    "policy_discription": item.policy_discription,
                }
                return item_dict
            else:
                print("not found")
                return None
        finally:
            session.close()

    def add_policy(self, name, description):
        session = self.Session()
        try:
            new_policy = self.policy(policy_name=name, policy_discription=description)
            session.add(new_policy)
            session.commit()
            print(f"Policy '{name}' added successfully.")
        finally:
            session.close()

    def delete_policy(self, policy_id):
        session = self.Session()
        try:
            policy = session.query(self.policy).filter_by(policy_id=policy_id).first()
            if policy:
                session.delete(policy)
                session.commit()
                print(f"Policy ID {policy_id} deleted.")
            else:
                print("Policy not found.")
        finally:
            session.close()

    def view_all_policies(self):
        session = self.Session()
        try:
            policies = session.query(self.policy).all()
            result = []
            for items in policies:
                result.append(
                    {
                        "policy_id": items.policy_id,
                        "policy_name": items.policy_name,
                        "policy_discription": items.policy_discription,
                    }
                )
            return result
        finally:
            session.close()

    def get_policy_details_from_productid(self, policy_string):
        session = self.Session()
        try:
            policy_ids = list(map(int, policy_string.split(",")))
            policies = (
                session.query(self.policy)
                .filter(self.policy.policy_id.in_(policy_ids))
                .all()
            )

            result = []
            for p in policies:
                result.append(
                    {
                        "policy_id": p.policy_id,
                        "policy_name": p.policy_name,
                        "policy_description": p.policy_discription,
                    }
                )
            return result
        finally:
            session.close()


if __name__ == "__main__":
    pr = policy_repo()
    pr.add_policy("7-Day Return", "Customers can return items within 7 days.")
    print(pr.view_all_policies())

from base_db_class import db_class
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    Date,
)
from datetime import date
from itemrepository import item_repo


class cart_request(BaseModel):
    loginid: int
    product_id: int
    item_count: int
    added_date: str


class cart_repo(db_class):
    Base = declarative_base()

    class ListItem(Base):
        __tablename__ = "list_items"

        product_id = Column(Integer, primary_key=True, autoincrement=True)
        product_name = Column(String(100), nullable=False)
        MRP = Column(Float, nullable=False)
        discount = Column(Float)
        stock_avl = Column(Integer)
        free_delivery_status = Column(Boolean, nullable=False)
        item_category = Column(
            Integer, ForeignKey("category.category_id"), nullable=False
        )
        product_image = Column(String(100), nullable=False)
        applicable_policies = Column(String(250), nullable=False)
        specs = Column(String(100), nullable=False)

    class Login(Base):
        __tablename__ = "login"
        loginid = Column(Integer, primary_key=True, autoincrement=True)
        UserName = Column(String(50), nullable=False, unique=True)
        first_name = Column(String(50), nullable=False)
        last_name = Column(String(50), nullable=False)
        emailaddress = Column(String(100), nullable=False)
        phoneNo = Column(String(15), nullable=False)
        password = Column(String(100), nullable=False)
        DateOfBirth = Column(Date)
        gender = Column(String(10))

    class Cart(Base):
        __tablename__ = "cart"

        cart_id = Column(Integer, primary_key=True, autoincrement=True)
        loginid = Column(Integer, ForeignKey("login.loginid"), nullable=False)
        product_id = Column(
            Integer,
            ForeignKey("list_items.product_id", ondelete="CASCADE"),
            nullable=False,
        )
        item_count = Column(Integer, nullable=False)
        added_date = Column(Date, nullable=False)

    def add_item_to_cart(self, a: cart_request):
        session = self.Session()
        try:
            item = (
                session.query(self.Cart)
                .filter_by(loginid=a.loginid, product_id=a.product_id)
                .first()
            )
            if item:
                item.item_count = a.item_count
                item.added_date = a.added_date
            else:
                item = self.Cart(
                    loginid=a.loginid,
                    product_id=a.product_id,
                    item_count=a.item_count,
                    added_date=a.added_date,
                )
            session.add(item)
            session.commit()
            print("added")
            return True
        finally:
            session.close()

    def get_cart_list(self, loginid):
        session = self.Session()
        try:
            # Join cart and product info
            items = (
                session.query(self.Cart, self.ListItem)
                .join(self.ListItem, self.Cart.product_id == self.ListItem.product_id)
                .filter(self.Cart.loginid == loginid)
                .all()
            )

            cart_list = []
            for cart_item, product in items:
                cart_list.append({
                    "cart_id": cart_item.cart_id,
                    "product_id": cart_item.product_id,
                    "item_count": cart_item.item_count,
                    "added_date": str(cart_item.added_date),
                    "product_name": product.product_name,
                    "MRP": product.MRP,
                    "product_image": product.product_image,
                    "discount": product.discount
                })

            return cart_list
        finally:
            session.close()


    def delete_item_from_cart(self, loginid, product_id):
        session = self.Session()
        try:
            item = (
                session.query(self.Cart)
                .filter_by(loginid=loginid, product_id=product_id)
                .first()
            )
            if item:
                session.delete(item)
                session.commit()
                print("Item deleted from cart.")
            else:
                print("Item not found in cart.")
        finally:
            session.close()
    
    def clear_cart(self, loginid: int):
        session = self.Session()
        try:
            session.query(self.Cart).filter_by(loginid=loginid).delete()
            session.commit()
            print(f"✅ All cart items deleted for login_id {loginid}")
            return {"message": "Cart cleared successfully."}
        finally:
            session.close()

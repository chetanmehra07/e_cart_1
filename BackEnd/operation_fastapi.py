from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union, Dict, List
from login_repository import signup_request, login_repo
from itemrepository import item_repo
from policies_repository import policy_repo
from category_repository import category_repo
from user_address_repository import user_address_repo, address_request
import uvicorn
from fastapi.responses import JSONResponse
from custom_exception import CustomException
from cart_repository import cart_request, cart_repo
from rating_repository import rating_repo
from buy_history_repository import buy_history_repo
from orders_repository import order_repo,OrderRequest

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})


class CartItem(BaseModel):
    name: str
    price: float
    quantity: int = 1
    is_offer: Union[bool, None] = None


store_items = {
    1: {"name": "Laptop", "price": 75000},
    2: {"name": "Headphones", "price": 2500},
    3: {"name": "Keyboard", "price": 1500},
    4: {"name": "Mouse", "price": 800},
}

cart: Dict[int, Dict] = {}
orders: Dict[int, List[Dict]] = {}
order_id_counter = 1


@app.get("/")
def read_root():
    return {"message": "Welcome to the e-Cart API"}


###########  g  e  t  #################


@app.get("/store")
def get_store_items():
    item = item_repo().view_all_items()
    return item


@app.get("/store/product")
def get_item(product_id):
    item = item_repo().getdata(product_id)
    return item


@app.post("/store/add")
def add_item(
    name, mrp, discount, stock, free_delivery: bool, category_id, image, policies, specs
):
    return item_repo().add_item(
        name, mrp, discount, stock, free_delivery, category_id, image, policies, specs
    )


@app.get("/policy")
def get_policy(policy_id):
    policy = policy_repo().getdata(policy_id)
    return policy


@app.get("/policy/all")
def get_all_policy():
    policy = policy_repo().view_all_policies()
    return policy


@app.delete("/policy/delete")
def delete_policy(policy_id):
    return policy_repo().delete_policy(policy_id)


@app.get("/category/products")
def get_all_category_products(category_id):
    return category_repo().getdata(category_id)


@app.get("/categories")
def get_all_categories():
    return category_repo().view_all_categories()


@app.get("/product")
def get_all_details_of_item(product_id):
    return item_repo().view_all_details_of_item(product_id)


#######################  login    #############


@app.post("/login/signup")
def signup(signup_details: signup_request):
    try:

        return login_repo().signup(signup_details)
    except CustomException as e:
        return JSONResponse(str(e), status_code=400)
    except Exception as e:
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


@app.get("/login/signin")
def signin(phoneNo, passward):
    try:
        return login_repo().signin(phoneNo, passward)
    except CustomException as e:
        return JSONResponse(str(e), status_code=400)
    except Exception as e:
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


@app.get("/login/info")
def login_info(loginid):
    try:
        return login_repo().get_login_info(loginid)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


###############        cart       ############
@app.post("/cart/add")
def add_to_cart(cart_details: cart_request):
    try:
        return cart_repo().add_item_to_cart(cart_details)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


@app.get("/cart")
def view_cart(loginid):
    return cart_repo().get_cart_list(loginid)


@app.delete("/cart/remove")
def remove_from_cart(loginid, productid):
    return cart_repo().delete_item_from_cart(loginid, productid)


######################################    address   #########################
@app.delete("/user_address/delete")
def delete_address(address_id):
    return user_address_repo().delete_address(address_id)


@app.get("/user_address/get")
def get_address(login_id):
    return user_address_repo().get_addresses_by_login(login_id)


@app.post("/user_address/add")
def add_address(address_detail: address_request):
    try:
        return user_address_repo().add_address(address_detail)

    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


@app.post("/address/change")
def change_default_address(loginid, address_id):
    try:
        return login_repo().update_address(loginid, address_id)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


########################  ratings          #################
@app.post("/rate/")
def rate_product(login_id: int, product_id: int, rating: int, comment: str = None):
    if rating < 1 or rating > 5:
        return {"error": "Rating must be between 1 and 5"}
    return rating_repo().give_rating(login_id, product_id, rating, comment)


@app.get("/rating/get")
def show_rating(product_id: int):
    return rating_repo().get_rating(product_id)


@app.delete("/rate/")
def delete_rating(login_id: int, product_id: int):
    return rating_repo().delete_rating(login_id, product_id)


@app.delete("/rate/comment/")
def delete_comment(login_id: int, product_id: int):
    return rating_repo().delete_comment(login_id, product_id)


######################    buy history ##############################

@app.post("/order")
def place_order(order_details: OrderRequest):
    try:
        return order_repo().order_item(order_details)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)

@app.get("/orders/get")
def get_user_orders(login_id: int):
    try:
        return order_repo().update_and_get_user_orders(login_id)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


@app.delete("/buy_history/remove")
def remove_from_buy_history(loginid):
    return buy_history_repo().delete_buy_item(loginid)


@app.get("/buy_history")
def get_buy_history(login_id):
    try:
        return buy_history_repo().get_buy_history(login_id)
    except Exception as e:
        print(e)
        return JSONResponse("SOMETHING WENT WRONG", status_code=400)


if __name__ == "__main__":
    uvicorn.run("operation_fastapi:app", host="127.0.0.1", port=8000, reload=True)

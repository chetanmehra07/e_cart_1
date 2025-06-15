@app.get("/store")
def get_store_items():
    try:
        item = item_repo().view_all_items()
        return item
    except Exception as e:
        print("Error in /store:", e)
        return JSONResponse({"error": "Something went wrong."}, status_code=500)
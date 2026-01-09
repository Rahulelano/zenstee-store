const API_URL = "/api";

const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    } : { "Content-Type": "application/json" };
};

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Login failed");
        }
        return res.json();
    },
    // Products
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    },
    getProduct: async (id: string) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
    },
    createProduct: async (data: any) => {
        const res = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Failed to create product");
        }
        return res.json();
    },
    updateProduct: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update product");
        return res.json();
    },
    deleteProduct: async (id: string) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
    },
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const url = `${API_URL}/upload`;
        console.log("Uploading to:", url);
        // Upload usually needs multipart/form-data, but fetch handles it if we pass FormData body and NO Content-Type header.
        // We might need Authorization though.
        const token = localStorage.getItem("adminToken");
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: formData,
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Failed to upload image");
        }
        return res.text(); // Returns path as text
    },
    // Payment
    createOrder: async (amount: number) => {
        const res = await fetch(`${API_URL}/payment/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || errorData.error || "Failed to create order");
        }
        return res.json();
    },
    verifyPayment: async (data: any) => {
        const res = await fetch(`${API_URL}/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Payment verification failed");
        return res.json();
    },
    // Orders
    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
    }
};

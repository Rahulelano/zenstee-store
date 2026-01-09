import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        images: "", // Comma separated for simplicity now
        category: "T-Shirt",
        stock: "0",
        sizes: "0-6 Months, 0-1 Years, 1-2 Years, 3-4 Years, 5-6 Years",
        inStock: true
    });

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            api.getProduct(id).then(product => {
                setFormData({
                    ...product,
                    images: product.images.join(", "),
                    sizes: product.sizes.join(", ")
                });
            }).catch(() => {
                toast({ title: "Error", description: "Failed to load product", variant: "destructive" });
            }).finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
            sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean)
        };

        try {
            if (isEditMode) {
                await api.updateProduct(id, payload);
                toast({ title: "Success", description: "Product updated successfully" });
            } else {
                await api.createProduct(payload);
                toast({ title: "Success", description: "Product created successfully" });
            }
            navigate("/admin/products");
            navigate("/admin/products");
        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Failed to save product", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading && isEditMode) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? "Edit Product" : "Create Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" value={formData.category} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="images">Product Images</Label>
                            <div className="flex flex-col gap-4">
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="cursor-pointer"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            setLoading(true);
                                            try {
                                                const uploadedPaths = [];
                                                for (let i = 0; i < files.length; i++) {
                                                    const path = await api.uploadFile(files[i]);
                                                    // Backend returns relative path "/uploads/...", we prepend server URL for display
                                                    // But for storage, we keep the relative path or full path as returned
                                                    // The api.uploadFile returns whatever backend sends. 
                                                    // Backend sends: `/${req.file.path}` which is relative to server root e.g. /uploads/file.jpg
                                                    // We need to make sure we construct full URL for display if needed. 
                                                    // Let's assume the backend returns a usable path.
                                                    uploadedPaths.push(path);
                                                }

                                                // Append new images to existing ones
                                                const currentImages = formData.images ? formData.images.split(",").map(s => s.trim()).filter(Boolean) : [];
                                                const newImages = [...currentImages, ...uploadedPaths].join(", ");
                                                setFormData(prev => ({ ...prev, images: newImages }));

                                                toast({ title: "Success", description: "Images uploaded successfully" });
                                            } catch (error: any) {
                                                console.error(error);
                                                toast({ title: "Error", description: error.message || "Failed to upload images", variant: "destructive" });
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }}
                                />
                                {formData.images && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                        {formData.images.split(",").map((img, index) => {
                                            const imgUrl = img.trim();
                                            // Handling both full URLs (legacy) and relative uploads
                                            // RELATIVE PATH FIX: Use the path directly so Vite proxy handles it
                                            // Robustness: Handle absolute paths from legacy/cached backend logic by extracting /uploads/
                                            let displayUrl = imgUrl;
                                            if (!displayUrl.startsWith("http")) {
                                                const uploadIndex = displayUrl.indexOf("/uploads/");
                                                if (uploadIndex !== -1) {
                                                    displayUrl = displayUrl.substring(uploadIndex);
                                                }
                                            }

                                            return (
                                                <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                                                    <img src={displayUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const images = formData.images.split(",").map(s => s.trim()).filter(Boolean);
                                                            const newImages = images.filter((_, i) => i !== index).join(", ");
                                                            setFormData(get => ({ ...get, images: newImages }));
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sizes">Sizes (Comma separated)</Label>
                            <Input id="sizes" name="sizes" value={formData.sizes} onChange={handleChange} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="inStock"
                                checked={formData.inStock}
                                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                            />
                            <Label htmlFor="inStock">In Stock</Label>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductForm;

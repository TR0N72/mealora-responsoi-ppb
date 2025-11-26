import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const menuSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.string().refine((val) => !isNaN(Number(val)), "Price must be a number"),
    category: z.string().min(1, "Category is required"),
    image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type MenuFormValues = z.infer<typeof menuSchema>;

interface MenuItemData {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export default function Admin() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check for admin role (basic client-side check, server verifies token)
    const token = localStorage.getItem('token');
    if (!token) {
        // Ideally decode token to check role, but for now redirect if no token
        // navigate('/auth'); // This causes render loop if used directly in body
    }

    const form = useForm<MenuFormValues>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            name: "",
            price: "",
            category: "Meal Set",
            image: "",
        },
    });

    const { data: menuItems, isLoading } = useQuery<MenuItemData[]>({
        queryKey: ['menu'],
        queryFn: async () => {
            const response = await fetch('/api/v1/menu');
            if (!response.ok) throw new Error('Failed to fetch menu');
            return response.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (values: MenuFormValues) => {
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            const file = fileInput?.files?.[0];

            let body;
            let headers: Record<string, string> = {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };

            if (file) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('price', values.price);
                formData.append('category', values.category);
                formData.append('stock_quantity', '100');
                formData.append('available_date', new Date().toISOString());
                if (values.image) formData.append('image', values.image); // Send URL if present (though UI logic clears it)
                formData.append('image', file); // Multer looks for 'image' field

                body = formData;
                // Don't set Content-Type for FormData, browser sets it with boundary
            } else {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    ...values,
                    price: Number(values.price),
                    stock_quantity: 100,
                    available_date: new Date().toISOString(),
                });
            }

            const response = await fetch('/api/v1/menu', {
                method: 'POST',
                headers,
                body,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create item');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            toast({ title: "Success", description: "Menu item added" });
            form.reset();
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);

    // ... createMutation ...

    const updateMutation = useMutation({
        mutationFn: async (values: MenuFormValues) => {
            if (!editingItem) return;

            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            const file = fileInput?.files?.[0];

            let body;
            let headers: Record<string, string> = {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };

            if (file) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('price', values.price);
                formData.append('category', values.category);
                if (values.image) formData.append('image', values.image);
                formData.append('image', file);

                body = formData;
            } else {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    ...values,
                    price: Number(values.price),
                });
            }

            const response = await fetch(`/api/v1/menu/${editingItem.id}`, {
                method: 'PUT',
                headers,
                body,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update item');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            toast({ title: "Success", description: "Menu item updated" });
            form.reset();
            setEditingItem(null);
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/v1/menu/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            toast({ title: "Success", description: "Menu item deleted" });
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: MenuFormValues) => {
        if (editingItem) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    };

    const handleEdit = (item: MenuItemData) => {
        setEditingItem(item);
        form.reset({
            name: item.name,
            price: item.price.toString(),
            category: item.category,
            image: item.image,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        form.reset({
            name: "",
            price: "",
            category: "Meal Set",
            image: "",
        });
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="py-12 px-4 max-w-[1273px] mx-auto">
                <h1 className="font-modak text-4xl mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add/Edit Item Form */}
                    <div className="lg:col-span-1 border border-black rounded-[25px] p-6 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-modak text-2xl">{editingItem ? "Edit Item" : "Add New Item"}</h2>
                            {editingItem && (
                                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Item name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Price" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Meal Set">Meal Set</SelectItem>
                                                    <SelectItem value="Snack Set">Snack Set</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input placeholder="Image URL (https://...)" {...field} />
                                                    <div className="text-center text-sm text-gray-500">- OR -</div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                form.setValue("image", "");
                                                            }
                                                        }}
                                                        id="file-upload"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {(createMutation.isPending || updateMutation.isPending) ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : (
                                        editingItem ? <Pencil className="mr-2" /> : <Plus className="mr-2" />
                                    )}
                                    {editingItem ? "Update Item" : "Add Item"}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Item List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="font-modak text-2xl mb-6">Menu Items</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menuItems?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-black rounded-xl">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-100 rounded-lg" />
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.category} - Rp {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => deleteMutation.mutate(item.id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

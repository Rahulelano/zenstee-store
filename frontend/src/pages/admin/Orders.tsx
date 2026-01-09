import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

const Orders = () => {
    const { data: orders, isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: api.getOrders,
    });

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (isError) return <div className="p-8 text-red-500">Failed to load orders.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Orders
            </h1>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Items</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.map((order: any) => (
                                    <>
                                        <TableRow
                                            key={order._id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => toggleExpand(order._id)}
                                        >
                                            <TableCell className="font-mono text-xs">{order._id.slice(-6)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.customerDetails.name}</span>
                                                    <span className="text-xs text-muted-foreground">{order.customerDetails.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy")}</TableCell>
                                            <TableCell className="font-bold text-primary">₹{order.totalAmount}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {order.orderItems?.length || 0} Item(s)
                                                {expandedOrderId === order._id ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />}
                                            </TableCell>
                                        </TableRow>

                                        {/* Expanded Details */}
                                        {expandedOrderId === order._id && (
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableCell colSpan={6}>
                                                    <div className="p-4 space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2 text-sm text-foreground">Shipping Details</h4>
                                                                <p className="text-sm text-muted-foreground">{order.customerDetails.address}</p>
                                                                <p className="text-sm text-muted-foreground">{order.customerDetails.phone}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2 text-sm text-foreground">Payment Info</h4>
                                                                <p className="text-sm text-muted-foreground">ID: {order.paymentInfo?.id}</p>
                                                                <p className="text-sm text-muted-foreground">Status: {order.paymentInfo?.status}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="font-semibold mb-2 text-sm text-foreground">Order Items</h4>
                                                            <div className="space-y-2">
                                                                {order.orderItems.map((item: any, idx: number) => (
                                                                    <div key={idx} className="flex items-center gap-4 bg-background p-2 rounded border border-border">
                                                                        {item.image && (
                                                                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                                        )}
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                                                                            <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                                                        </div>
                                                                        <div className="text-sm font-bold">
                                                                            {item.quantity} x ₹{item.price}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Orders;

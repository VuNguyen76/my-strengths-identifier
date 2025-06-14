
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Download, Search, Filter } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const itemsPerPage = 10;

  const { data: transactions = [], isLoading, error } = useAdminTransactions(searchTerm);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      // Apply text search
      const matchesSearch =
        searchTerm === "" ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.booking?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      // Apply date filter
      let matchesDate = true;
      if (dateRange?.from && dateRange?.to) {
        const transactionDate = parseISO(transaction.created_at);
        matchesDate = isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, dateRange]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500">Hoàn tiền</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to export transactions to Excel
  const exportToExcel = () => {
    try {
      // Format the data for Excel
      const excelData = filteredTransactions.map(transaction => ({
        'ID Giao dịch': transaction.id,
        'Ngày': format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm"),
        'Khách hàng': transaction.booking?.customer_name || '',
        'Dịch vụ': transaction.booking?.booking_services?.[0]?.service?.name || '',
        'Chuyên viên': transaction.booking?.specialist?.name || '',
        'Số tiền': transaction.amount,
        'Trạng thái': transaction.status === 'completed' ? 'Hoàn thành' : 
                    transaction.status === 'pending' ? 'Đang xử lý' : 
                    transaction.status === 'failed' ? 'Thất bại' : 
                    transaction.status === 'refunded' ? 'Hoàn tiền' : 'Không xác định',
        'Phương thức': transaction.payment_method || ''
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Giao dịch");

      // Generate Excel file and download
      XLSX.writeFile(workbook, "bao-cao-giao-dich.xlsx");
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Có lỗi khi xuất Excel!");
    }
  };

  // Apply date filter
  const handleDateRangeApply = () => {
    if (dateRange?.from && dateRange?.to) {
      toast.success(`Đã lọc giao dịch từ ${format(dateRange.from, "dd/MM/yyyy")} đến ${format(dateRange.to, "dd/MM/yyyy")}`);
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
    toast.success("Đã xóa bộ lọc ngày");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý giao dịch</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý giao dịch</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý giao dịch</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  <span>Lọc theo ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="flex items-center p-3 border-t border-border">
                {dateRange?.from && dateRange?.to && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearDateFilter}
                    className="mr-auto"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
                <Button size="sm" onClick={handleDateRangeApply}>
                  Áp dụng
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giao dịch thanh toán</CardTitle>
          <CardDescription>Quản lý tất cả các giao dịch thanh toán trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo ID, khách hàng..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="refunded">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Giao dịch</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Chuyên viên</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phương thức</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.transaction_id || transaction.id}
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{transaction.booking?.customer_name || 'N/A'}</TableCell>
                      <TableCell>{transaction.booking?.booking_services?.[0]?.service?.name || 'N/A'}</TableCell>
                      <TableCell>{transaction.booking?.specialist?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(transaction.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Không tìm thấy giao dịch nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious href="#" />
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
              <PaginationNext href="#" />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;

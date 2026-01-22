import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Alert,
} from "@/components/ui";
import { transactionsApi } from "@/api";
import type { CreateTransactionRequest } from "@/types";

const transactionSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().min(1, "Currency is required"),
  location: z.string().min(1, "Location is required"),
  payment_method: z.string().min(1, "Payment method is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const currencyOptions = [
  { value: "INR", label: "🇮🇳 INR - Indian Rupee" },
  { value: "USD", label: "🇺🇸 USD - US Dollar" },
  { value: "EUR", label: "🇪🇺 EUR - Euro" },
  { value: "GBP", label: "🇬🇧 GBP - British Pound" },
];

const paymentMethodOptions = [
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Debit/Credit Card" },
  { value: "NETBANKING", label: "Net Banking" },
  { value: "WALLET", label: "Digital Wallet" },
];

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      currency: "INR",
      payment_method: "UPI",
    },
  });

  const amount = watch("amount");

  const mutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsApi.create(data),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      if (transaction.Status === "BLOCKED") {
        toast.error("Transaction was blocked due to high risk");
      } else if (transaction.Status === "FLAGGED") {
        toast.success("Transaction created but flagged for review");
      } else {
        toast.success("Transaction created successfully");
      }

      navigate("/transactions");
    },
    onError: () => {
      // Error handled by axios interceptor
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Create New Transaction</CardTitle>
          <CardDescription>
            Enter the transaction details below. The transaction will be
            automatically evaluated for fraud risk.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {amount > 10000 && (
              <Alert variant="warning" title="High Amount Transaction">
                Transactions above ₹10,000 may be flagged for additional review.
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                placeholder="1000"
                leftIcon={<CreditCard className="h-4 w-4" />}
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
              />

              <Select
                label="Currency"
                options={currencyOptions}
                error={errors.currency?.message}
                {...register("currency")}
              />
            </div>

            <Input
              label="Location"
              type="text"
              placeholder="Mumbai, India"
              leftIcon={<MapPin className="h-4 w-4" />}
              error={errors.location?.message}
              {...register("location")}
            />

            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              error={errors.payment_method?.message}
              {...register("payment_method")}
            />
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/transactions")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Create Transaction
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

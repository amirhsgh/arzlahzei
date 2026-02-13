import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-7xl font-bold text-primary">۴۰۴</h1>
      <h2 className="mb-4 text-2xl font-bold">صفحه مورد نظر یافت نشد</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است. لطفاً آدرس
        صفحه را بررسی کنید.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button>بازگشت به صفحه اصلی</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">تماس با ما</Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { timeAgo } from "@/lib/utils/date";
import { toPersianDigits } from "@/lib/utils/format";

interface Comment {
  id: string;
  priceSlug: string;
  author: string;
  email: string;
  text: string;
  parentId: string | null;
  createdAt: string;
  replies?: Comment[];
}

function CommentForm({
  slug,
  parentId,
  onSubmitted,
  onCancel,
}: {
  slug: string;
  parentId?: string;
  onSubmitted: (comment: Comment) => void;
  onCancel?: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceSlug: slug, author, email, text, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || "خطا در ارسال نظر");
        return;
      }

      const newComment = await res.json();
      onSubmitted(newComment);
      setAuthor("");
      setEmail("");
      setText("");
    } catch {
      setSubmitError("خطا در ارسال نظر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="نام"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="نام شما"
          required
        />
        <Input
          label="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل شما (نمایش داده نمی‌شود)"
          dir="ltr"
          required
        />
      </div>
      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {parentId ? "پاسخ" : "نظر"}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={parentId ? "پاسخ خود را بنویسید..." : "نظر خود را بنویسید..."}
          required
          rows={3}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {submitError && (
        <p className="text-sm text-negative">{submitError}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? "در حال ارسال..." : parentId ? "ارسال پاسخ" : "ارسال نظر"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            انصراف
          </Button>
        )}
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  slug,
  depth,
  onReplyAdded,
}: {
  comment: Comment;
  slug: string;
  depth: number;
  onReplyAdded: (parentId: string, reply: Comment) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={depth > 0 ? "mr-4 border-r-2 border-border pr-4 sm:mr-6 sm:pr-6" : ""}>
      <div className="rounded-lg border border-border p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            {toPersianDigits(timeAgo(comment.createdAt))}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {comment.text}
        </p>
        {depth < 2 && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 text-xs text-primary hover:underline"
          >
            {showReplyForm ? "بستن" : "پاسخ"}
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-3 mr-4 sm:mr-6">
          <CommentForm
            slug={slug}
            parentId={comment.id}
            onSubmitted={(reply) => {
              onReplyAdded(comment.id, reply);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              slug={slug}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("خطا در بارگذاری نظرات");
        setLoading(false);
      });
  }, [slug]);

  const addReplyToTree = (list: Comment[], parentId: string, reply: Comment): Comment[] => {
    return list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies || []), reply] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyToTree(c.replies, parentId, reply) };
      }
      return c;
    });
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments((prev) => addReplyToTree(prev, parentId, reply));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>نظرات کاربران</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommentForm
          slug={slug}
          onSubmitted={(comment) => setComments((prev) => [comment, ...prev])}
        />

        {loading && (
          <p className="text-sm text-muted-foreground">در حال بارگذاری نظرات...</p>
        )}
        {error && <p className="text-sm text-negative">{error}</p>}
        {!loading && !error && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
        )}
        {comments.length > 0 && (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                slug={slug}
                depth={0}
                onReplyAdded={handleReplyAdded}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

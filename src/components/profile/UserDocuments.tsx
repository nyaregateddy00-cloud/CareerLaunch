import React, { useEffect, useRef, useState } from 'react';
import { Download, FileText, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  deleteUserDocument,
  getUserDocumentUrl,
  listUserDocuments,
  uploadUserDocument,
  UserDocument,
  UserDocumentCategory,
} from '../../lib/documentService';

const categoryLabels: Record<UserDocumentCategory, string> = {
  cv: 'CV / Resume',
  certificate: 'Certificate',
  application: 'Application document',
  other: 'Other',
};

function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const UserDocuments: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isRemoteUser = Boolean(user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id));
  const canUpload = isSupabaseConfigured && isRemoteUser;
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [category, setCategory] = useState<UserDocumentCategory>('cv');
  const [loading, setLoading] = useState(canUpload);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    try {
      setDocuments(await listUserDocuments());
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not load your documents.';
      setError(message);
    }
  };

  useEffect(() => {
    setDocuments([]);
    if (!canUpload) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void refresh().finally(() => setLoading(false));
  }, [user?.id, canUpload]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await uploadUserDocument(file, category);
      await refresh();
      showToast('Document uploaded securely.', 'success');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not upload this document.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async (document: UserDocument) => {
    try {
      const signedUrl = await getUserDocumentUrl(document);
      window.open(signedUrl, '_blank', 'noopener,noreferrer');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Could not open this document.', 'error');
    }
  };

  const handleDelete = async (document: UserDocument) => {
    if (!window.confirm(`Delete “${document.file_name}” from your documents?`)) return;
    try {
      await deleteUserDocument(document);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      showToast('Document deleted.', 'success');
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Could not delete this document.', 'error');
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Career documents</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Keep CVs, certificates, and application files in your private workspace.</p>
        </div>
        {canUpload && (
          <div className="flex flex-col sm:flex-row gap-2">
            <select aria-label="Document type" value={category} onChange={(event) => setCategory(event.target.value as UserDocumentCategory)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={handleFile} className="sr-only" />
            <Button size="sm" variant="primary" disabled={busy} onClick={() => inputRef.current?.click()} leftIcon={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}>
              {busy ? 'Uploading…' : 'Upload document'}
            </Button>
          </div>
        )}
      </div>

      {!isSupabaseConfigured ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">Secure uploads need the CareerLaunch Supabase project to be configured.</p>
      ) : !isRemoteUser ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">Secure uploads are available after signing in to a Supabase-backed account. Local demo profiles do not have a private cloud file store.</p>
      ) : loading ? (
        <div className="flex items-center gap-2 py-4 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading your documents…</div>
      ) : error && documents.length === 0 ? (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">{error}</p>
      ) : documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center dark:border-slate-700">
          <FileText className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">No documents uploaded yet</p>
          <p className="mt-1 text-xs text-slate-500">Upload a CV or certificate to keep it ready for applications.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {documents.map((document) => (
            <div key={document.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/50 dark:text-brand-blue-300"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{document.file_name}</p>
                <p className="text-[11px] text-slate-500">{categoryLabels[document.category]} · {fileSize(Number(document.size_bytes))}</p>
              </div>
              <button type="button" onClick={() => void handleOpen(document)} aria-label={`Open ${document.file_name}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-blue-700 dark:hover:bg-slate-800"><Download className="h-4 w-4" /></button>
              <button type="button" onClick={() => void handleDelete(document)} aria-label={`Delete ${document.file_name}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
      {error && documents.length > 0 && <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">{error}</p>}
      <p className="text-[11px] text-slate-400">PDF, Word, JPEG, PNG, or WebP · up to 15 MB. Your files are private to your account.</p>
    </Card>
  );
};

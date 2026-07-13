import { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import Topbar from '../components/dashboard/Topbar';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import StudentForm from '../components/forms/StudentForm';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/studentService';
import { useToast } from '../context/ToastContext';

export default function AdminStudents() {
  const { openMobileSidebar } = useOutletContext();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [formModal, setFormModal] = useState({ open: false, student: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(
    () => studentService.list({ page, limit: 10, search: debouncedSearch }),
    [page, debouncedSearch]
  );
  const { data, loading, error, refetch } = useFetch(fetcher, [page, debouncedSearch]);

  const students = data?.data || [];
  const pagination = data?.pagination;

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (formModal.student) {
        await studentService.update(formModal.student.id, payload);
        toast.success('Student updated successfully.');
      } else {
        await studentService.create(payload);
        toast.success('Student added successfully.');
      }
      setFormModal({ open: false, student: null });
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to save student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentService.remove(deleteTarget.id);
      toast.success('Student deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (student) => {
    try {
      await studentService.togglePublish(student.id, !student.published);
      toast.success(student.published ? 'Result hidden.' : 'Result published.');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update publish status.');
    }
  };

  const columns = [
    { key: 'hallTicket', header: 'Hall Ticket' },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department' },
    { key: 'semester', header: 'Sem' },
    {
      key: 'published',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.published ? 'success' : 'neutral'}>
          {row.published ? 'Published' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePublish(row)}
            className="p-2 rounded-lg text-mist-400 hover:text-mist-100 hover:bg-white/5 transition-colors"
            title={row.published ? 'Hide result' : 'Publish result'}
          >
            {row.published ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button
            onClick={() => setFormModal({ open: true, student: row })}
            className="p-2 rounded-lg text-mist-400 hover:text-mist-100 hover:bg-white/5 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar
        title="Students"
        subtitle="Manage student records and results"
        onOpenMobile={openMobileSidebar}
        actions={
          <Button icon={Plus} onClick={() => setFormModal({ open: true, student: null })}>
            Add Student
          </Button>
        }
      />

      <div className="p-5 lg:p-8 flex-1">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name, hall ticket, or registration number…"
          className="max-w-md mb-6"
        />

        {loading && <Loader label="Loading students…" />}
        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && students.length === 0 && (
          <EmptyState
            title="No students found"
            description="Add a student manually or import results via Excel."
            action={
              <Button size="sm" icon={Plus} onClick={() => setFormModal({ open: true, student: null })}>
                Add Student
              </Button>
            }
          />
        )}

        {!loading && !error && students.length > 0 && (
          <>
            <Table columns={columns} data={students} />
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, student: null })}
        title={formModal.student ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <StudentForm
          initialData={formModal.student}
          onSubmit={handleSave}
          onCancel={() => setFormModal({ open: false, student: null })}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete student?"
        message={`This will permanently remove ${deleteTarget?.name} and all associated subject records. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}

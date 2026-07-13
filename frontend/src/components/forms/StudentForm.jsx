import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const emptySubject = () => ({
  subjectName: '',
  internalMarks: '',
  externalMarks: '',
  credits: '',
});

const emptyStudent = {
  hallTicket: '',
  registrationNumber: '',
  name: '',
  fatherName: '',
  motherName: '',
  department: '',
  semester: 1,
  section: '',
  email: '',
  phone: '',
};

export default function StudentForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyStudent);
  const [subjects, setSubjects] = useState([emptySubject()]);

  useEffect(() => {
    if (initialData) {
      setForm({
        hallTicket: initialData.hallTicket || '',
        registrationNumber: initialData.registrationNumber || '',
        name: initialData.name || '',
        fatherName: initialData.fatherName || '',
        motherName: initialData.motherName || '',
        department: initialData.department || '',
        semester: initialData.semester || 1,
        section: initialData.section || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      });
      setSubjects(
        initialData.subjects?.length
          ? initialData.subjects.map((s) => ({
              subjectName: s.subjectName,
              internalMarks: s.internalMarks,
              externalMarks: s.externalMarks,
              credits: s.credits,
            }))
          : [emptySubject()]
      );
    }
  }, [initialData]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateSubject = (index, field, value) => {
    setSubjects((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSubject = () => setSubjects((prev) => [...prev, emptySubject()]);
  const removeSubject = (index) => setSubjects((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanSubjects = subjects
      .filter((s) => s.subjectName.trim())
      .map((s) => ({
        subjectName: s.subjectName,
        internalMarks: Number(s.internalMarks) || 0,
        externalMarks: Number(s.externalMarks) || 0,
        credits: Number(s.credits) || 0,
      }));

    onSubmit({ ...form, semester: Number(form.semester), subjects: cleanSubjects });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Hall Ticket No."
          value={form.hallTicket}
          onChange={(e) => updateField('hallTicket', e.target.value)}
          required
        />
        <Input
          label="Registration No."
          value={form.registrationNumber}
          onChange={(e) => updateField('registrationNumber', e.target.value)}
          required
        />
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
        <Input
          label="Department"
          value={form.department}
          onChange={(e) => updateField('department', e.target.value)}
          required
        />
        <Input
          label="Semester"
          type="number"
          min={1}
          max={8}
          value={form.semester}
          onChange={(e) => updateField('semester', e.target.value)}
          required
        />
        <Input
          label="Section"
          value={form.section}
          onChange={(e) => updateField('section', e.target.value)}
        />
        <Input
          label="Father's Name"
          value={form.fatherName}
          onChange={(e) => updateField('fatherName', e.target.value)}
        />
        <Input
          label="Mother's Name"
          value={form.motherName}
          onChange={(e) => updateField('motherName', e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-mist-300">Subjects</h4>
          <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={addSubject}>
            Add Subject
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {subjects.map((s, i) => (
            <div key={i} className="glass rounded-xl p-3 grid grid-cols-12 gap-2 items-end">
              <Input
                containerClassName="col-span-12 sm:col-span-4"
                label={i === 0 ? 'Subject' : undefined}
                value={s.subjectName}
                onChange={(e) => updateSubject(i, 'subjectName', e.target.value)}
                placeholder="Subject name"
              />
              <Input
                containerClassName="col-span-4 sm:col-span-2"
                label={i === 0 ? 'Internal' : undefined}
                type="number"
                value={s.internalMarks}
                onChange={(e) => updateSubject(i, 'internalMarks', e.target.value)}
              />
              <Input
                containerClassName="col-span-4 sm:col-span-2"
                label={i === 0 ? 'External' : undefined}
                type="number"
                value={s.externalMarks}
                onChange={(e) => updateSubject(i, 'externalMarks', e.target.value)}
              />
              <Input
                containerClassName="col-span-4 sm:col-span-2"
                label={i === 0 ? 'Credits' : undefined}
                type="number"
                value={s.credits}
                onChange={(e) => updateSubject(i, 'credits', e.target.value)}
              />
              <div className="col-span-12 sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeSubject(i)}
                  className="p-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Remove subject"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Save Changes' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}

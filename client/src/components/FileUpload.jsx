export default function FileUpload({ name="resumeFile", onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">Upload Resume (.pdf/.doc/.docx/.jpg/.png)</label>
      <input
        type="file"
        name={name}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={onChange}
        className="w-full border p-2 rounded bg-white"
      />
    </div>
  )
}

export default function Algorithm({ algorithm, setAlgorithm }) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Algorithm</h2>
        <textarea
          className="flex-1 w-full p-2 border border-gray-300 rounded resize-none"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          placeholder="Write your algorithm here..."
        />
      </div>
    );
  }
  
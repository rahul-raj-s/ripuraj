export const Input = ({ label = "", placeholder = "",className="input w-full", error, ...rest }) => {
  return (
    <div className="">
      {rest.type === "textarea" && (
        <textarea className="textarea my-1" placeholder="Address" />
      )}
      {
        rest.type==="checkbox" && <input className={className} type={rest.type} />
      }
     {
      rest.type==="text" && <input className={className} value={rest.value} onChange={rest.onChange} placeholder={placeholder} required />
     }
        
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

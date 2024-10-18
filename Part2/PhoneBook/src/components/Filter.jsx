const Filter = ({ filter, handleFilterChange }) => {
  return (
    <>
      filter show with: <input value={filter} onChange={handleFilterChange} />
    </>
  );
};

export default Filter;

import "./WatchListStocks";

function WatchListStocks({ toggleListIds, list }) {
  const isListOpen = toggleListIds.includes(list.id);


  console.log(list)
  return (
    <>
      {isListOpen && (
        <div>
          <h1>{list.name}</h1>
        </div>
      )}
    </>
  );
}

export default WatchListStocks;

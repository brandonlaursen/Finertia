import "./WatchListStocks.css";

function WatchListStocks({ toggleListIds, list }) {
  const isListOpen = toggleListIds.includes(list.id);



  return (
    <>
      {isListOpen && (
        <div className="WatchListStocks">
          <div className='WatchListStocks__container'>
          <span className='WatchListStocks__container-title' >SNAP</span>
          <span className='WatchListStocks__container-graph' >Graph</span>
          <span className='WatchListStocks__container-data'>
            <span className='WatchListStocks__container-price'>$10.58</span>
            <span className='WatchListStocks__container-percent'>- 0.42%</span>
          </span>
          </div>
        </div>
      )}
    </>
  );
}

export default WatchListStocks;

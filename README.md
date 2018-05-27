# factory-fun

![Factory Fun](https://cf.geekdo-images.com/original/img/c4bBs2aWEiaX2WaXANMenft4H48=/0x0/pic802170.jpg)

Software to model and measure processing elements in a factory system.

Name is a based on the boardgame [Factory Fun](https://boardgamegeek.com/boardgame/24417/factory-fun)

General idea of this project:

processing step
  - have inventory coming in and out
  - inventory can be filtered to be a certain type
  - multi input inventory?
  - inventory that is not currently processing is in the processing queue

  processing queue
   - inventory waiting to go into the processing step
   - way to choose next item(s) FIFO, LIFO, etc, value estimate.
   - measure time into q and exit q per inventory item

  - inventory is assigned to a processing unit
  - one processing unit is a serial processing step. applied effort is on all inventory in the unit (like a kiln)
  - more than one processing unit makes it a parallel step.

  processing units
   - a unit type? 
   - min/max number of inventory the unit can allow at once
   - provide or calculate an ETA
   - apply effort on inventory. effort has a cost and progresses inventory as a percentage.
   - bi-products (usually waste) can be measured for each applied effort and thus can also be rate measured
   - mistakes/failures in processing come out as defects
   - success in processing come out as a finished product. This can be a typed product
   - measure time into q and exit q per inventory item
   - processing unit can have wear applied.


   - finished products are moved to the next processing step as inventory

A factory is a DAG with processing steps as nodes, and movement of finished products into inventory to the next processing step.

graph.sources() returns the processing steps that have no in-edges, therefore are the start of the factory
graph.sinks() returns the processing steps that have no out-edges therefore are the end of the factory



## CLI Usage

    npm i factory-fun -g
    factory-fun

## License

MIT

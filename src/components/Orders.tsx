import React from "react";
import DataTable from "react-data-table-component";
import Spinner from "./Spinner";
import Skeleton from "@mui/material/Skeleton";
import { useParams, useSearchParams } from "react-router-dom";
console.log(process.env.HOST);
export function Orders() {
  const [data, setData] = React.useState([]);
  const [tempData, setTempadata] = React.useState([]);
  const [value, setValue] = React.useState("one");
  const [loader, setLoader] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const filterData = (searchItem) => {
    searchItem = searchItem.toLocaleLowerCase();
    let newFilteredArray = tempData?.filter((value) => {
      let orgStr = JSON.stringify(value).toLocaleLowerCase();
      return orgStr.indexOf(searchItem) >= 0;
    });
    setData([...newFilteredArray]);
  };
  React.useEffect(() => {
    const shop = searchParams.get("shop");
    console.log(shop + "current page shop");
    fetch(`${process.env.HOST}/listOrders?shop=${shop}`).then((res) => {
      setSearchParams(window.location.href);
      res.json().then((res) => {
        setTempadata(res);
        setData(res);
        if (res != 0) {
          setLoader(false);
        }
      });
    });
  }, []);
  console.log(data);
  //   function Timer() {
  //     setTimeout( hideloader, 6000);
  // }
  // Timer();
  // function hideloader(){
  //   if(data.length==0){
  //   document.getElementById('my-spinner')
  //   .style.display = 'none';
  //   document.getElementById('msg').innerHTML = 'No data to display';
  //   }
  // }
  data.forEach((x, index) => {
    x.serial = index + 1;
  });
  const columns = [
    {
      name: "S-no",
      selector: "serial",
    },
    {
      name: "Order-ID",
      selector: (row: { order_id: Number }) => row.order_id,
    },
    {
      name: "First_name",
      selector: (row: { first_name: String }) => row.first_name,
    },
    {
      name: "Order-Token",
      selector: (row: { order_token: String }) => row.order_token,
    },
    {
      name: "Fullfillment-status",
      selector: (row: { fulfillment_status: String }) => row.fulfillment_status,
    },
    {
      name: "Shop-name",
      selector: (row: { shop_name: String }) => row.shop_name,
    },
  ];
  return (
    <>
      {loader ? (
        <>
          <Skeleton height={60} animation="wave" />
          <Skeleton height={40} />
          <Skeleton height={40} animation="wave" />
          <Skeleton height={40} />
          <Skeleton height={40} animation="wave" />
          <Skeleton height={40} />
          <Skeleton height={40} animation="wave" />
        </>
      ) : (
        <div>
          <div className="form-outline">
            <input
              type="text"
              id="typeText"
              placeholder="Search...."
              className="form-control"
              onChange={(e) => {
                filterData(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>
          <DataTable
            columns={columns}
            noDataComponent={<Spinner />}
            data={data}
            pagination
            selectableRows
          />
          <div>
            <p style={{ textAlign: "center" }} id="msg"></p>
          </div>
        </div>
      )}
    </>
  );
}

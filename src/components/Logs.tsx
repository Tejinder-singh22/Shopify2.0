import React from "react";
import DataTable from "react-data-table-component";
import Spinner from "./Spinner";
import Skeleton from "@mui/material/Skeleton";
import { useParams, useSearchParams } from "react-router-dom";
export function Logs() {
  const [data, setData] = React.useState([]);
  const [tempData, setTempadata] = React.useState([]);
  const [value, setValue] = React.useState("one");
  const [loader, setLoader] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const filterData = (searchItem: any) => {
    searchItem = searchItem.toLocaleLowerCase();
    let newFilteredArray = tempData?.filter((value) => {
      let orgStr = JSON.stringify(value).toLocaleLowerCase();
      return orgStr.indexOf(searchItem) >= 0;
    });
    setData([...newFilteredArray]);
  };

  React.useEffect(() => {
    try {
      const shop = searchParams.get("shop");
      console.log(shop + "current page shop");
      fetch(`${process.env.HOST}/listLogs?shop=${shop}`).then((res) => {
        res.json().then((res) => {
          if (res.result != null) {
            setTempadata(res.result);
            setData(res.result);

            setLoader(false);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  console.log(data);

  data.forEach((x, index) => {
    x.serial = index + 1;
  });
  const columns = [
    {
      name: "S-no",
      selector: "serial",
    },
    {
      name: "Order Id",
      selector: (row) => row.order_id,
    },
    {
      name: "Error Type",
      selector: (row) => row.log_type,
    },
    {
      name: "Error Message",
      selector: (row) => row.log_error[0]["message"],
    },
    {
      name: "Shop-name",
      selector: (row) => row.shop_name,
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
            <p style={{ textAlign: "center" }} id="msg">
              abc
            </p>
          </div>
        </div>
      )}
    </>
  );
}

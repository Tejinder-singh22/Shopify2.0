import React from "react";
import DataTable from "react-data-table-component";
import Spinner from "./Spinner";
import Skeleton from "@mui/material/Skeleton";
import { useParams, useSearchParams } from "react-router-dom";
export function Customers() {
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
      fetch(`${process.env.HOST}/listCustomers?shop=${shop}`).then((res) => {
        res.json().then((res) => {
          setTempadata(res);
          setData(res);
          if (res != 0) {
            setLoader(false);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  console.log(data);
  //   function Timer() {
  //     setTimeout( hideloader, 6000);
  // }
  // Timer();
  // function hideloader(){
  //   if(data.length==0){
  //   document.getElementById('my-inner-spinner')
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
      name: "Name",
      selector: (row) => row.formData[0]["firstname"],
    },
    {
      name: "Email",
      selector: (row) => row.formData[0]["email"],
    },
    {
      name: "Gender",
      selector: (row) => row.formData[0]["gender"],
    },
    {
      name: "Date Of Birth",
      selector: (row) => row.formData[0]["dob"],
    },
    {
      name: "Mobile Number",
      selector: (row) => row.formData[0]["mobileNumber"],
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
            <p style={{ textAlign: "center" }} id="msg"></p>
          </div>
        </div>
      )}
    </>
  );
}

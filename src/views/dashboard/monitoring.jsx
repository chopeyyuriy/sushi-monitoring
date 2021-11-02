import React, {useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Pusher from 'pusher-js';
import styled from 'styled-components';

const StyledCalendar = styled.div`
  color: grey;
  background: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  input {
    color: gray;
    border: 1px gray solid;
  }
`;
const Monitoring = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [calendar, setCalendar] = useState()

    const columns = [
      {
        name: "Ресторан",
        selector: row => row.restaurant,
        sortable: true
      },
      {
        name: "без доставки",
        selector: row => row.without_delivery,
        sortable: true
      },
      {
        name: "с доставкой",
        selector: row =>  row.with_delivery,
        sortable: true,
      },
      {
        name: "ваучеров  без доставки",
        selector: row => row.voucher_without_delivery,
        sortable: true
      },
      {
        name: "ваучеров  с доставкой",
        selector: row =>  row.voucher_with_delivery,
        sortable: true
      },
      {
        name: "Остаток по ваучерам",
        selector: row =>  row.voucher_max,
        sortable: true,
      },
      {
        name: "Продано ваучеров",
        selector: row =>  row.vouchers_remains,
        sortable: true,
      },
      {
        name: "Бронь для обычных заказов",
        selector: row =>  row.simple_order_time_disabled,
        sortable: true,
        width: "auto"
      },
      {
        name: "Бронь для товаров по ваучеру",
        selector: row =>  row.voucher_order_time_disabled,
        sortable: true,
        width: "auto"
      }
    ];

    useEffect(() => {    
      Pusher.logToConsole = true;

      const pusher = new Pusher('c5d9a52120e033bb2f56', {
        app_id: "1289297",
        key: "c5d9a52120e033bb2f56",
        secret: "be74597ef3dbf8d0ec1c",
        cluster: "eu",
      });
  
      const channel = pusher.subscribe('setting-update');
    
      channel.bind('App\\Events\\Manager\\SettingUpdate', (data) => {
        setRestaurants([])
        data.restaurantsSettings.map((e,i) => {
          setRestaurants(prevState => [...prevState,
                  {
                      id: e.id ,
                      restaurant: e.name,
                      without_delivery: e.settings[0].queue ,
                      with_delivery:  e.settings[0].queue_delivery,
                      voucher_without_delivery:  e.settings[0].queue_voucher,
                      voucher_with_delivery:  e.settings[0].queue_voucher_delivery,
                      voucher_max:  e.settings[0].max_voucher,
                      vouchers_remains: e.vouchers_remains,
                      simple_order_time_disabled: e.settings[0].simple_order_time_disabled ? e.settings[0].simple_order_time_disabled.map(e => `${e}  `) : '',
                      voucher_order_time_disabled: e.settings[0].voucher_order_time_disabled ? e.settings[0].voucher_order_time_disabled.map(e =>  `${e}  `) : ''
                  }
              ])
          })

      });

      fetch('https://mere.mysushi.ee/api/restaurants-settings', {
            method: "GET"
        }).then(resp => resp.json())
          .then(data => {
              data.restaurantsSettings.map((e,i) => {
                  setRestaurants(prevState => [...prevState,
                      {
                          id: e.id ,
                          restaurant: e.name,
                          without_delivery: e.settings[0].queue ,
                          with_delivery:  e.settings[0].queue_delivery,
                          voucher_without_delivery:  e.settings[0].queue_voucher,
                          voucher_with_delivery:  e.settings[0].queue_voucher_delivery,
                          voucher_max:  e.settings[0].max_voucher,
                          vouchers_remains: e.vouchers_remains,
                          simple_order_time_disabled: e.settings[0].simple_order_time_disabled ? e.settings[0].simple_order_time_disabled.map(e => `${e}  `) : '',
                          voucher_order_time_disabled: e.settings[0].voucher_order_time_disabled ? e.settings[0].voucher_order_time_disabled.map(e =>  `${e}  `) : ''
                      }
                  ])
              })
          })
    }, [])
    
    return (
      <div>
        <StyledCalendar>
          <input type="date" onChange={(e) => setCalendar(e.target.value)}/>
        </StyledCalendar>
        <DataTable
          columns={columns}
          data={restaurants}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          paginationPerPage="30"
          highlightOnHover
          width="auto"
        />
      </div>
    )
  }
export default Monitoring

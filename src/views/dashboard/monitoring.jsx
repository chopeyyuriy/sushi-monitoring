import React, {useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import Pusher from 'pusher-js';
import styled from 'styled-components';
import 'bootstrap';
import {Formik, Field} from 'formik';

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

const StyledFilter = styled.div`
  margin-left: 30px;
  span {
    font-size: 15px;;
    cursor: pointer;
  }
  label {
    margin-left: 10px
  }
`;

const Monitoring = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [calendar, setCalendar] = useState();
    const [hidecolumns, setHideColumns] = useState([]);
    const [toggleFilter, setToggleFilter] = useState(false)
    const [restaurant, setRestaurant] = useState(false);
    const [without_delivery, setWithout_delivery] = useState(false);
    const [with_delivery, setWith_delivery] = useState(false);
    const [voucher_with_delivery, setVoucher_with_delivery] = useState(false);
    const [voucher_without_delivery, setVoucher_without_delivery] = useState(false);
    const [voucher_max, setVoucher_max] = useState(false);
    const [vouchers_remains, setVouchers_remains] = useState(false);
    const [simple_order_time_disabled, setSimple_order_time_disabled] = useState(false);
    const [voucher_order_time_disabled, setVoucher_order_time_disabled] = useState(false);

    const columns = React.useMemo(
      () => [
      {
        name: "Ресторан",
        selector: row => row.restaurant,
        sortable: true,
        omit: restaurant
      },
      {
        name: "без доставки",
        selector: row => row.without_delivery,
        sortable: true,
        omit: without_delivery
      },
      {
        name: "с доставкой",
        selector: row =>  row.with_delivery,
        sortable: true,
        omit: with_delivery
      },
      {
        name: "ваучеров  без доставки",
        selector: row => row.voucher_without_delivery,
        sortable: true,
        omit: voucher_without_delivery
      },
      {
        name: "ваучеров  с доставкой",
        selector: row =>  row.voucher_with_delivery,
        sortable: true,
        omit: voucher_with_delivery
      },
      {
        name: "Остаток по ваучерам",
        selector: row =>  row.voucher_max,
        sortable: true,
        omit: voucher_max
      },
      {
        name: "Продано ваучеров",
        selector: row =>  row.vouchers_remains,
        sortable: true,
        omit: vouchers_remains
      },
      {
        name: "Перекрытое время для обычных заказов",
        selector: row =>  row.simple_order_time_disabled,
        sortable: true,
        style: {
          whiteSpace: 'unset'
       },
       omit: simple_order_time_disabled
      },
      {
        name: "Перекрытое время для товаров по ваучеру",
        selector: row =>  row.voucher_order_time_disabled,
        sortable: true,
        style: {
          whiteSpace: 'unset',
       },
       omit: voucher_order_time_disabled
      }
    ], [restaurant, without_delivery, with_delivery, voucher_without_delivery, voucher_with_delivery,
       voucher_max, vouchers_remains, simple_order_time_disabled, voucher_order_time_disabled]
    );

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
                      vouchers_remains: e.vouchers_today,
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
                          vouchers_remains: e.vouchers_today,
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
          <StyledFilter>
            <span onClick={() => setToggleFilter(!toggleFilter)}>Скрыть</span>
            {
              toggleFilter &&
              <div>
                <div>
                    <input 
                        type="checkbox"  
                        value="restaurant" 
                        id="restaurant"
                        name="filter"
                        checked={restaurant}
                        onClick={ ()=> setRestaurant(!restaurant)}
                    />
                    <label htmlFor="restaurant">Ресторан</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="without_delivery" 
                        id="without_delivery"
                        name="filter"
                        checked={without_delivery}
                        onClick={ ()=> setWithout_delivery(!without_delivery)}
                    />
                    <label htmlFor="without_delivery">без доставки</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="with_delivery" 
                        id="with_delivery"
                        name="filter"
                        checked={with_delivery}
                        onClick={ ()=> setWith_delivery(!with_delivery)}
                    />
                    <label htmlFor="with_delivery">с доставкой</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="voucher_without_delivery" 
                        id="voucher_without_delivery"
                        name="filter"
                        checked={voucher_without_delivery}
                        onClick={ ()=> setVoucher_without_delivery(!voucher_without_delivery)}
                    />
                    <label htmlFor="voucher_without_delivery">ваучеров  без доставки</label>

                </div> 
                <div>
                    <input 
                        type="checkbox"  
                        value="voucher_with_delivery" 
                        id="voucher_with_delivery"
                        name="filter"
                        checked={voucher_with_delivery}
                        onClick={ ()=> setVoucher_with_delivery(!voucher_with_delivery)}
                    />
                    <label htmlFor="voucher_with_delivery">ваучеров  с доставкой</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="voucher_max" 
                        id="voucher_max"
                        name="filter"
                        checked={voucher_max}
                        onClick={ ()=> setVoucher_max(!voucher_max)}
                    />
                    <label htmlFor="voucher_max">Остаток по ваучерам</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="vouchers_remains" 
                        id="vouchers_remains"
                        name="filter"
                        checked={vouchers_remains}
                        onClick={ ()=> setVouchers_remains(!vouchers_remains)}
                    />
                    <label htmlFor="vouchers_remains">Продано ваучеров</label>
                </div>
                <div>
                    <input 
                        type="checkbox"  
                        value="voucher_order_time_disabled" 
                        id="voucher_order_time_disabled" 
                        name="filter"
                        checked={voucher_order_time_disabled}
                        onClick={ ()=> setVoucher_order_time_disabled(!voucher_order_time_disabled)}
                    />
                    <label htmlFor="voucher_order_time_disabled">Перекрытое время для обычных заказов</label>
                </div>
               <div>
                    <input 
                        type="checkbox"  
                        value="simple_order_time_disabled" 
                        id="simple_order_time_disabled"
                        name="filter"
                        checked={simple_order_time_disabled}
                        onClick={ ()=> setSimple_order_time_disabled(!simple_order_time_disabled)}
                    />
                    <label htmlFor="simple_order_time_disabled">Перекрытое время для товаров по ваучеру</label>
               </div>
                    
              </div>
            }
          </StyledFilter>
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
          style={{whiteSpace: 'unset'}}
        />
      </div>
    )
  }
export default Monitoring

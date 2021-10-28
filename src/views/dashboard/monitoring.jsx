import React, { Component, useEffect,useState } from 'react';
import { Row, Col } from 'reactstrap';
import FullCard from '../table/bootstrap/example/basicEx';
import Pusher from 'pusher-js';

const Monitoring = () => {
    const [restaurants, setRestaurants] = useState();

    useEffect(() => {
        fetch('http://mysushi.rieltcrm.online/api/restaurants-settings', {
            method: "GET"
        }).then(resp => resp.json())
        .then(data => setRestaurants(data.response.restaurantsSettings))
        .then(console.log(restaurants))
    }, [])

    return (
      <Row>
        <FullCard title='Очередь'>
          <thead>
            <tr>
              <th>Ресторан</th>
              <th>без доставки</th>
              <th>с доставкой</th>
              <th>ваучеров  без доставки</th>
              <th>ваучеров  с доставкой</th>
              <th>Остаток по ваучерам</th>
            </tr>
          </thead>
          <tbody>
              {restaurants &&
                    restaurants.map((e,i) => (
                        <tr key={i}>
                            <td>{e.restaurants[0] ? `${++i}. ${e.restaurants[0].name}` : `${++i}.`}</td>
                            <td>{e.queue}</td>
                            <td>{e.queue_delivery}</td>
                            <td>{e.queue_voucher}</td>
                            <td>{e.queue_voucher_delivery}</td>
                            <td>{e.max_voucher}</td>
                        </tr>
                    ))
              }
          </tbody>
        </FullCard>
      </Row>
    )
  }
export default Monitoring

import http from 'k6/http';
import { check ,sleep } from 'k6';

export const options = {
    stages: [
        {duration: '3m', target: 1000}, // 3 minutes with 1000 VUs,
        {duration: '5m', target: 10000},
        {duration: '5m', target: 0},
    ],
    thresholds: {
        http_req_duration: ['p(99) < 100']
    }
}

export default function () {
    let i = 0
    const url = `https://example.com/${i}`;
    http.post('https://localhost:3001');
    sleep(1);
}
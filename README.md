# DrawSomething
> DrawSomething 是一個於網頁上實現你畫我猜的專案，包含以 [Express](https://expressjs.com/) 實作的 Server 端 與 [Vue](https://vuejs.org/) 實作的 Client 端，兩者透過 Socket.IO 進行資料傳輸以同步多個使用者的畫面

## 執行方式

### Server
```
cd DrawSomething
npm install
npm run serve
```
or
```
cd DrawSomething
yarn install
yarn run serve
```

### Client
```
cd masterpiece
npm install
npm run serve
```
or
```
cd masterpiece
yarn install
yarn run serve
```

## 專案特色

- 以自訂用戶名連線
- 在線人數統計
- 等待配對機制
- 即時畫布同步
- 遊戲流程(猜題驗證、角色置換)

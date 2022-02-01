const serialize = require("node-serialize");
const cart = [
  {
    image: "img/collec-1.jpg",
    title: "Pink roses",
    amount: "207",
    qty: "1",
  },
  {
    image: "img/collec-2.jpg",
    title: "Eleganr by BloomNation",
    amount: "207",
    qty: "1",
  },
  {
    image: "img/collec-3.jpg",
    title: "Queen Rose - Yellow",
    amount: "207",
    qty: "1",
  },
];
const getCarts = (data) => {
  //   const str = new Buffer.from(data, "base64").toString();
  const obj = serialize.unserialize(data);
  console.log("boj", obj);
  return obj;
};

module.exports = { getCarts, cart };

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79", // 크롬 79까지 지원하는 코드
          ie: "11", // npm i regenerator-runtime 필요함
        },
        //ECMAScript2015+를 ECMAScript5 버전으로 변환할 수 있는 것만 빌드한다.
        //그렇지 못한 것들은 "폴리필"이라고 부르는 코드조각을 추가해서 해결
        useBuiltIns: "usage", // 폴리필 사용 방식 지정
        corejs: {
          // 폴리필 버전 지정
          version: 2,
        },
      },
    ],
  ],
};

import { createStore } from "vuex";

const UNIT_ARRAY = {
  91: "Ядро/час",
  92: "Гбайт/час",
  93: "шт./мес.",
  94: "шт./час",
};

const RIGHTS_ARRAY = {
  102: "Read",
  103: "FullAccess",
};

function GetContacts(obj) {
  let res = new Array();
  for (var key in obj) {
    res.push(obj[key]);
  }
  return res;
}

function GetContent(obj) {
  for (var key in obj) {
    var value = obj[key];
  }
  return value;
}

export default createStore({
  state: {
    users: {},
    activeUsers: {},
    clients: [],
    posts: [],
    services: [],
    DCs: [],
    clientsServices: [],
    dialogAddClientVisible: false,
    dialogAddClientServiceVisible: false,
    clientServiceForm: {},
    clientClientForm: {},
    billingSections: {},
    currentUser: {},
    isLoggedOn: false,
  },
  getters: {
    usersData(state) {
      return state.users;
    },
    activeUsersData(state) {
      return state.activeUsers;
    },
    dialogServiceVisible(state) {
      return state.dialogServiceAddEditVisible;
    },
    dcsData(state) {
      return state.DCs;
    },
    servicvesData(state) {
      return state.services;
    },
    postsData(state) {
      return state.posts;
    },
    clientsData(state) {
      return state.clients;
    },
    billingSectionsData(state) {
      return state.billingSections;
    },
    clientServices(state) {
      return state.clientsServices;
    },
    clientPageData: (state) => (code) => {
      let clientObj = state.clients.find((client) => client.CODE === code);
      return clientObj;
    },
    clientsLinksData(state) {
      let clientsLink = [];
      state.clients.forEach((element) => {
        clientsLink.push("/clients/" + element.ID);
      });
      return clientsLink;
    },
    postsGridData(state) {
      let gridPost = [];
      state.posts.forEach((element) => {
        const postavshicFromResult = {
          id: element.ID,
          name: element.NAME,
          deal_num: element.DEAL_NUM,
          deal_date: element.DEAL_DATE,
          manager: state.users[element.MANAGER],
        };
        gridPost.push(postavshicFromResult);
      });
      return gridPost;
    },
    postPageData: (state) => (name) => {
      let postObj = state.posts.find((post) => post.NAME === name);
      return postObj;
    },
    postsLinksData(state) {
      let postsLink = [];
      state.posts.forEach((element) => {
        postsLink.push("/posts/" + element.ID);
      });
      return postsLink;
    },
    serviceGridData(state) {
      let gridService = [];
      state.services.forEach((element) => {
        const serviceFromResult = {
          name: element.NAME,
          full_name: element.FULL_NAME,
          unit: UNIT_ARRAY[element.UNIT],
          price: element.PRICE,
          data_center: state.DCs.find((DC) => DC.ID === element.DATA_CENTER)
            .NAME,
        };
        gridService.push(serviceFromResult);
      });
      return gridService;
    },
    partnerServices: (state) => (dc) => {
      let gridService = [];
      state.services.forEach((element) => {
        if (element.DATA_CENTER == dc) {
          const serviceFromResult = {
            id: element.ID,
            name: element.NAME,
            full_name: element.FULL_NAME,
            unit: UNIT_ARRAY[element.UNIT],
            price: element.PRICE,
            data_center: state.DCs.find((DC) => DC.ID === element.DATA_CENTER)
              .NAME,
          };
          gridService.push(serviceFromResult);
        }
      });
      return gridService;
    },
    serviceGridDataPL2(state) {
      let gridService = [];
      state.services.forEach((element) => {
        const serviceFromResult = {
          name: element.NAME,
          full_name: element.FULL_NAME,
          unit: UNIT_ARRAY[element.UNIT],
          price: element.PRICE_PL2,
          data_center: state.DCs.find((DC) => DC.ID === element.DATA_CENTER)
            .NAME,
        };
        gridService.push(serviceFromResult);
      });
      return gridService;
    },
    clientServicesData: (state) => (code) => {
      let clientServices = [];
      let clientID = state.clients.find((client) => client.CODE === code).ID;
      state.clientsServices.forEach((element) => {
        if (element.CLIENT === clientID) {
          let serv = state.services.find(
            (service) => service.ID === element.SERVICE
          );
          let service = {
            id: element.ID,
            code: element.CODE,
            name: serv.NAME,
            startDateTime: element.STARTDATETIME,
            endDateTime: element.ENDDATETIME,
            unit: UNIT_ARRAY[serv.UNIT],
            amount: element.AMOUNT,
            sale: element.SALE,
            post: state.posts.find(
              (post) =>
                post.ID ===
                state.DCs.find((DC) => DC.ID === serv.DATA_CENTER).POST_NAME
            ).NAME,
            data_center: state.DCs.find((DC) => DC.ID === serv.DATA_CENTER)
              .NAME,
            service_id: element.SERVICE,
            billing: serv.BILLING,
            visible: false,
            info: element.INFO,
          };
          clientServices.push(service);
        }
      });
      return clientServices;
    },
    clientAddServiceDCs(state) {
      let options = [];
      state.posts.forEach((post) => {
        let children = [];
        state.DCs.forEach((DC) => {
          let child = {};
          if (DC.POST_NAME === post.ID) {
            child = {
              value: DC.ID,
              label: DC.NAME,
            };
          }
          if (Object.keys(child).length != 0) {
            children.push(child);
          }
        });
        let opt = {
          value: post.ID,
          label: post.NAME,
          children: children,
        };
        if (children.length != 0) {
          options.push(opt);
        }
      });
      return options;
    },
    clientAddServiceServices: (state) => (DCID) => {
      let options = [];
      state.services.forEach((element) => {
        let opt = {};
        if (
          element.DATA_CENTER === DCID &&
          !element.INDIVIDUAL &&
          element.BILLING != 95
        ) {
          opt = {
            value: element.ID,
            label: element.NAME,
          };
        }
        if (Object.keys(opt).length != 0) {
          options.push(opt);
        }
      });
      return options;
    },
    clientAddIndividService: (state) => (DCID) => {
      let options = [];
      state.services.forEach((element) => {
        let opt = {};
        if (
          element.DATA_CENTER === DCID &&
          element.INDIVIDUAL == 1 &&
          element.BILLING == 95
        ) {
          opt = {
            value: element.ID,
            label: element.NAME,
          };
        }
        if (Object.keys(opt).length != 0) {
          options.push(opt);
        }
      });
      return options;
    },
    postIDByName: (state) => (name) => {
      let postID = state.posts.find((post) => post.NAME === name);
      return postID.ID;
    },
    dcIDByName: (state) => (name) => {
      let dcID = state.DCs.find((DC) => DC.NAME === name);
      return dcID.ID;
    },
    clientIDByName: (state) => (name) => {
      let clientID = state.clients.find((client) => client.NAME === name);
      return clientID.ID;
    },
    serviceIDByName: (state) => (name) => {
      let serviceID = state.services.find((service) => service.NAME === name);
      return serviceID.ID;
    },
    dialogClientAddVisible(state) {
      return state.dialogAddClientVisible;
    },
    dialogClientServiceAddVisible(state) {
      return state.dialogAddClientServiceVisible;
    },
    clientServiceForm(state) {
      return state.clientServiceForm;
    },
    clientClientForm(state) {
      return state.clientClientForm;
    },
    serviceByID: (state) => (ID) => {
      let service = state.services.find((service) => service.ID === ID);
      return service;
    },
    clientCodeByName: (state) => (name) => {
      return state.clients.find((client) => client.NAME === name).CODE;
    },
    clientNameByCode: (state) => (code) => {
      return state.clients.find((client) => client.CODE === code).NAME;
    },
    clientIDByCode: (state) => (code) => {
      return state.clients.find((client) => client.CODE === code).ID;
    },
    clientByCode: (state) => (code) => {
      return state.clients.find((client) => client.CODE === code);
    },
    currentUser(state) {
      return state.currentUser;
    },
    isLogged(state) {
      return state.isLoggedOn;
    },
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload;
    },
    setActiveUsers(state, payload) {
      state.activeUsers = payload;
    },
    nullClientsList(state) {
      state.clients = [];
    },
    setClientsData(state, payload) {
      state.clients = payload;
    },
    nullPostsList(state) {
      state.posts = [];
    },
    setPostsData(state, payload) {
      state.posts = payload;
    },
    nullServicesList(state) {
      state.services = [];
    },
    setServicesList(state, payload) {
      state.services = payload;
    },
    nullDCsList(state) {
      state.DCs = [];
    },
    setDCsList(state, payload) {
      state.DCs = payload;
    },
    nullClientsServices(state) {
      state.clientsServices = [];
    },
    setClientsServices(state, payload) {
      state.clientsServices = payload;
    },
    toggleServiceAddEditDialog(state) {
      state.dialogServiceAddEditVisible = !state.dialogServiceAddEditVisible;
    },
    closeAddClientDialog(state) {
      state.dialogAddClientVisible = false;
    },
    showAddClientDialog(state) {
      state.dialogAddClientVisible = true;
    },
    closeAddClientServiceDialog(state) {
      state.dialogAddClientServiceVisible = false;
    },
    showAddClientServiceDialog(state) {
      state.dialogAddClientServiceVisible = true;
    },
    setClientServiceForm(state, payload) {
      state.clientServiceForm = payload;
    },
    nullClientServiceForm(state) {
      state.clientServiceForm = {};
    },
    setClientAddForm(state, payload) {
      state.clientClientForm = payload;
    },
    nullClientAddForm(state) {
      state.clientClientForm = {};
    },
    setBillingSections(state, payload) {
      state.billingSections = payload;
    },
    nullBillingSections(state) {
      state.billingSections = {};
    },
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    nullCurrentUser(state) {
      state.currentUser = {};
    },
    LogOn(state) {
      state.isLoggedOn = true;
    },
    LogOff(state) {
      state.isLoggedOn = false;
    },
  },
  actions: {
    getClientsFromBitrix({ commit }) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=38&IBLOCK_TYPE_ID=lists"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let Clients = [];
          for (let i = 0; i < data.total; i++) {
            const clientFromResult = {
              ID: data.result[i].ID,
              NAME: data.result[i].NAME,
              FULL_NAME: GetContent(data.result[i].PROPERTY_185),
              INN: GetContent(data.result[i].PROPERTY_187),
              DEAL_NUM: GetContent(data.result[i].PROPERTY_188),
              DEAL_DATE: GetContent(data.result[i].PROPERTY_189),
              DEAL_SUB: GetContent(data.result[i].PROPERTY_190),
              DEAL_ADD: GetContent(data.result[i].PROPERTY_191),
              DEAL_CONT: GetContacts(data.result[i].PROPERTY_192),
              TECH_CONT: GetContacts(data.result[i].PROPERTY_193),
              MANAGER: GetContent(data.result[i].PROPERTY_205),
              CODE: GetContent(data.result[i].PROPERTY_298),
              PRICE_LIST: GetContent(data.result[i].PROPERTY_295),
              IN_TEST: GetContent(data.result[i].PROPERTY_308),
              CREATION_DATE: data.result[i].DATE_CREATE,
            };
            Clients.push(clientFromResult);
          }
          commit("nullClientsList");
          commit("setClientsData", Clients);
          console.log("Client");
        });
    },
    getPostavshicsFromBitrix({ commit }) {
      fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=39&IBLOCK_TYPE_ID=lists"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let Posts = [];
          for (let i = 0; i < data.total; i++) {
            const postFromResult = {
              ID: data.result[i].ID,
              NAME: data.result[i].NAME,
              FULL_NAME: GetContent(data.result[i].PROPERTY_195),
              INN: GetContent(data.result[i].PROPERTY_197),
              DEAL_NUM: GetContent(data.result[i].PROPERTY_198),
              DEAL_DATE: GetContent(data.result[i].PROPERTY_199),
              DEAL_SUB: GetContent(data.result[i].PROPERTY_200),
              DEAL_CONT: GetContacts(data.result[i].PROPERTY_202),
              TECH_CONT: GetContacts(data.result[i].PROPERTY_203),
              MANAGER: GetContent(data.result[i].PROPERTY_204),
              CREATION_DATE: data.result[i].DATE_CREATE,
            };
            Posts.push(postFromResult);
          }
          commit("nullPostsList");
          commit("setPostsData", Posts);
          console.log("Postavshic");
        });
    },
    getUsersFromBitrix({ commit }) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/n022plnkzrgil3rm/user.get.json"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let usersArray = {};
          let activeUsers = {};
          for (let i = 0; i < data.total; i++) {
            usersArray[data.result[i].ID] =
              data.result[i].LAST_NAME + " " + data.result[i].NAME;
            if (data.result[i].ACTIVE) {
              activeUsers[data.result[i].ID] =
                data.result[i].LAST_NAME + " " + data.result[i].NAME;
            }
          }
          commit("setUsers", usersArray);
          commit("setActiveUsers", activeUsers);
          console.log("Users");
        });
    },
    getServicesFromBitrix({ commit }) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=42&IBLOCK_TYPE_ID=lists"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let Services = [];
          for (let i = 0; i < data.total; i++) {
            const serviceFromResult = {
              ID: data.result[i].ID,
              NAME: data.result[i].NAME,
              FULL_NAME: GetContent(data.result[i].PROPERTY_225),
              UNIT: GetContent(data.result[i].PROPERTY_226),
              PRICE: GetContent(data.result[i].PROPERTY_227),
              DATA_CENTER: GetContent(data.result[i].PROPERTY_228),
              BILLING: GetContent(data.result[i].PROPERTY_242),
              INDIVIDUAL: GetContent(data.result[i].PROPERTY_309),
            };
            Services.push(serviceFromResult);
          }
          commit("nullServicesList");
          commit("setServicesList", Services);
          console.log("Services");
        });
    },
    getDCFromBitrix({ commit }) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=40&IBLOCK_TYPE_ID=lists"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let DCs = [];
          for (let i = 0; i < data.total; i++) {
            const DCFromResult = {
              ID: data.result[i].ID,
              NAME: data.result[i].NAME,
              POST_NAME: GetContent(data.result[i].PROPERTY_222),
            };
            DCs.push(DCFromResult);
          }
          commit("nullDCsList");
          commit("setDCsList", DCs);
          console.log("DCs");
        });
    },
    getClientsServsFromBitrix(
      { commit, getters },
      params = { client_name: "", client_id: 0, client_code: "" }
    ) {
      let client_param = 0;
      if (params.client_id) {
        client_param = params.client_id;
      } else if (params.client_code) {
        client_param = getters.clientIDByCode(params.client_code);
      } else {
        client_param = getters.clientIDByName(params.client_name);
      }
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=41&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_236]=" +
          client_param
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let clientsServices = [];
          for (let i = 0; i < data.total; i++) {
            const CSFromResult = {
              ID: data.result[i].ID,
              CODE: data.result[i].CODE,
              SERVICE: GetContent(data.result[i].PROPERTY_234),
              SALE: GetContent(data.result[i].PROPERTY_235),
              CLIENT: GetContent(data.result[i].PROPERTY_236),
              AMOUNT: GetContent(data.result[i].PROPERTY_237),
              STARTDATETIME: GetContent(data.result[i].PROPERTY_238),
              ENDDATETIME: GetContent(data.result[i].PROPERTY_239),
              INFO: GetContent(data.result[i].PROPERTY_307),
            };
            clientsServices.push(CSFromResult);
          }
          commit("nullClientsServices");
          commit("setClientsServices", clientsServices);
          console.log("ClientsServices");
        });
    },
    getBillsSectionsFromBitrix({ commit }) {
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/p9o3u51ll580x8tk/lists.section.get.json?IBLOCK_ID=43&IBLOCK_TYPE_ID=lists"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let sectionsArray = {};
          for (let i = 0; i < data.total; i++) {
            sectionsArray[data.result[i].NAME] = data.result[i].ID;
          }
          commit("nullBillingSections");
          commit("setBillingSections", sectionsArray);
        });
    },
    getReportPageService({ getters }, clientCode) {
      return new Promise((resolve) => {
        resolve(getters.clientServicesData(clientCode));
      });
    },
    getReportPagePartnerService({ getters }, service_id) {
      return new Promise((resolve) => {
        resolve(getters.serviceByID(service_id));
      });
    },
    getCurrentUser({ commit }, userInfo) {
      commit("nullCurrentUser");
      return fetch(
        "https://bitrix.d-platforms.ru/rest/54/24zaixqjk1cndtsp/lists.element.get.json?IBLOCK_ID=51&IBLOCK_TYPE_ID=lists&FILTER[PROPERTY_313]=" +
          userInfo.email
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (GetContent(data.result[0].PROPERTY_312) == userInfo.password) {
            return fetch(
              "https://bitrix.d-platforms.ru/rest/54/n022plnkzrgil3rm/user.get.json?ID=" +
                GetContent(data.result[0].PROPERTY_310)
            )
              .then((response) => {
                return response.json();
              })
              .then((data2) => {
                commit("setCurrentUser", {
                  ID: GetContent(data.result[0].PROPERTY_310),
                  RIGHT: RIGHTS_ARRAY[GetContent(data.result[0].PROPERTY_311)],
                  PASSWORD: GetContent(data.result[0].PROPERTY_312),
                  EMAIL: GetContent(data.result[0].PROPERTY_313),
                  ISLOGGEDIN: true,
                  NAME: data2.result[0].NAME,
                  LAST_NAME: data2.result[0].LAST_NAME,
                  PASSWDCHA__ID: data.result[0].ID,
                  PASSWDCHA_NAME: data.result[0].NAME,
                });
                commit("LogOn");
              });
          } else {
            return false;
          }
        });
    },
  },
});

<template lang="html">
   <div>
    <v-card>

      <v-toolbar
        height="70px"
        dense
      >

          <v-flex xs2>
            <v-dialog
              ref="diagInicio"
              v-model="modalInicio"
              :return-value.sync="dataInicio"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                v-validate="'required'"
                slot="activator"
                v-model="this.formatDate(dataInicio)"
                label="Data Inicial"
                readonly
              ></v-text-field>
              <v-date-picker
                color="grey"
                header-color="grey"
                v-model="dataInicio"
                scrollable
                locale="pt-br"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="black" @click="modalInicio = false">Cancelar</v-btn>
                <v-btn flat color="black" @click="$refs.diagInicio.save(dataInicio)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
          
          <v-spacer></v-spacer>

          <v-flex xs2>
            <v-dialog
              ref="diagFim"
              v-model="modalFim"
              :return-value.sync="dataFim"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                v-validate="'required'"
                slot="activator"
                v-model="this.formatDate(dataFim)"
                label="Data Final"
                readonly
              ></v-text-field>
              <v-date-picker
                color="grey"
                header-color="grey"
                v-model="dataFim"
                scrollable
                locale="pt-br"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="black" @click="modalFim = false">Cancelar</v-btn>
                <v-btn flat color="black" @click="$refs.diagFim.save(dataFim)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-spacer></v-spacer>

          <v-btn color="grey lighten-2" @click="generateReport()">Nova Consulta</v-btn>

      </v-toolbar>

      <v-data-table
        ref="table"
        :headers="headers"
        :items="relatorio"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
      >

        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ formatDate(props.item.dataPgto) }}</td>
          <td class="text-xs-left">{{ formatCPF(props.item.associado.cpf) }}</td>
          <td class="text-xs-left">{{ props.item.associado.nome }}</td>
          <td class="text-xs-left">{{ fixCurrency(props.item.valorPago) }}</td>
          <td class="text-xs-left">{{ props.item.formapgto }}</td>
        </template>

        <template slot="footer">
  <tr class="text-xs-center" v-for="(column, index) in headers">
    <strong v-if="column.calcular">Total: {{ fixCurrency(calcTotal(column)) }}</strong>
  </tr>
</template>

      </v-data-table>
    
          <v-btn  id="_csv"
                  fab
                  dark
                  large
                  right
                  absolute
                  color="green lighten"
          ><v-icon dark>print</v-icon></v-btn>

            <v-btn  id="_pdf"
                  fab
                  dark
                  large
                  right
                  absolute
                  color="red"
          ><v-icon dark>print</v-icon></v-btn>

        
  </v-card>

  </div>

  
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";
import moment from "moment";

export default {
  $_veeValidate: {
    validator: "new"
  },

  data: () => ({
    modalFim: false,
    modalInicio: false,
    search: "",
    dataInicio: new Date().toISOString().substr(0, 10),
    dataFim: new Date().toISOString().substr(0, 10),
    total: "",
    pagination: {
      rowsPerPage: 0,
      totalItems: 0,
      sortBy: "dataPgto"
    },
    dialog: false,
    headers: [
      {
        text: "Data do Pagamento",
        align: "left",
        sortable: false,
        value: "dataPgto"
      },
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "associado.cpf"
      },

      {
        text: "Nome",
        align: "left",
        value: "associado.nome",
        sortable: false
      },
      {
        text: "Valor Pago",
        value: "valorPago",
        calcular: true,
        sortable: false
      },
      {
        text: "Forma do Pagamento",
        value: "formapgto",
        sortable: false
      }
    ],
    pagamentos: [],
    relatorio: []
  }),

  computed: {
    dataPgto() {
      return this.date ? moment(this.date).format("DD/MM/YYYY") : "";
    },

    dataInicio() {
      return this.date ? moment(this.date).format("DD/MM/YYYY") : "";
    },

    dataFim() {
      return this.date ? moment(this.date).format("DD/MM/YYYY") : "";
    },

    formTitle() {
      return this.editedIndex === -1 ? "Novo Pagamento" : "Editar Pagamento";
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    relatorio() {
      this.$nextTick(() => {
        this.pagination.totalItems = this.relatorio.length;
        this.pagination.rowsPerPage = this.pagination.totalItems;
      });
    }
  },

  created() {
    this.initialize();
  },

  mounted() {
    this.$validator.localize("pt", this.dictionary);
  },

  methods: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    formatAxiosDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split("/");
      console.log("axios date: " + year + "-" + month + "-" + day);
      return `${year}-${month}-${day}`;
    },

    fixCurrency(number) {
      return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },

    formatCPF(cpf) {
      cpf = cpf.replace(/[^\d]/g, "");

      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },

    rmMaskCPF(cpf) {
      return cpf.replace(/[^\d]/g, "");
    },

    generateReport() {
      console.log("inicio " + this.dataInicio);
      console.log("fim " + this.dataFim);

      API.getRelatorio(
        this.formatDate(this.dataInicio),
        this.formatDate(this.dataFim)
      ).then(response => {
        this.relatorio = response;
        console.dir("retornou " + this.relatorio);
      });
      this.pagination.totalItems = this.relatorio.length;
      this.pagination.rowsPerPage = this.relatorio.length;
      this.load();
    },

    load() {},

    initialize() {
      this.load();
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // alert("Form Submitted!");
          return;
        }
      });
    },

    calcTotal(column) {
      const table = this.$refs.table;
      //console.log('table',table);
      return table
        ? table.filteredItems.reduce((s, i) => {
            return s + parseInt(i[column.value], 10);
          }, 0)
        : 0;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#_pesquisar {
  align-self: center;
}

#_pdf {
  position: fixed;
  bottom: 15px;
  right: 100px;
}

#_csv {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
</style>

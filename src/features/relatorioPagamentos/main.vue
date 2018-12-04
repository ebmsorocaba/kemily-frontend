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
              v-model="modal"
              :return-value.sync="dataInicio"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                v-validate="'required'"
                slot="activator"
                v-model="dataInicio"
                :error-messages="errors.collect('dataInicio')"
                label="Data Inicial"
                data-vv-name="dataInicio"
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
                <v-btn flat color="black" @click="modal = false">Cancelar</v-btn>
                <v-btn flat color="black" @click="$refs.dialog.save(dataInicio)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex xs2>
            <v-dialog
              ref="diagInicio"
              v-model="modal"
              :return-value.sync="dataFim"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                v-validate="'required'"
                slot="activator"
                v-model="dataFim"
                :error-messages="errors.collect('dataFim')"
                label="Data Final"
                data-vv-name="dataFim"
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
                <v-btn flat color="black" @click="modal = false">Cancelar</v-btn>
                <v-btn flat color="black" @click="$refs.dialog.save(dataFim)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-spacer></v-spacer>

          <v-btn color="grey lighten-2" @click="">Nova Consulta</v-btn>

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
          <td class="text-xs-left">{{ formatCPF(props.item.cpf) }}</td>
          <td class="text-xs-left">{{ props.item.nome }}</td>
          <td class="text-xs-left">{{ fixCurrency(props.item.total) }}</td>
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
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    search: "",
    dataInicio: "01-01-2017",
    dataFim: "01-01-2019",
    total: 1000,
    pagination: {
      rowsPerPage: 0,
      totalItems: 0,
      sortBy: "dataPgto"
    },
    dialog: false,
    headers: [
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "cpf"
      },

      {
        text: "Nome",
        align: "left",
        value: "nome",
        sortable: false
      },
      {
        text: "Total Pago",
        value: "total",
        calcular: true,
        sortable: false
      }
    ],
    pagamentos: [],
    relatorio: [],
    dictionary: {
      attributes: {},
      custom: {
        cpf: {
          required: () => "Informe o CPF do associado!",
          alpha_num: () => "Informe um CPF valido!",
          min: () => "Informe um CPF valido!"
        },
        nome: {
          required: () => "Informe o nome do associado!",
          min: () => "O nome do associado deve conter no minimo 4 caracteres!",
          alpha_spaces: () => "Informe um nome valido!"
        },
        valorPago: {
          required: () => "Informe o valor do pagamento!",
          decimal: () => "Informe um valor valido!",
          min_value: () => "O valor do pagamento não pode ser negativo ou zero!"
        },
        dataPgto: {
          required: () => "Informe o dia do vencimento do pagamento",
          numeric: () => "Informe o dia do vencimento do pagamento!"
        },
        formapgto: {
          required: () => "Selecione a forma do Pagamento!"
        }
      }
    },
    formasPgto: ["Dinheiro", "Cartão", "Boleto"]
  }),

  computed: {
    dataPgto() {
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
    },
    isCompleted() {
      return (
        this.editedItem.associado.valorAtual &&
        this.date &&
        this.editedItem.formapgto &&
        this.editedItem.associado.cpf &&
        this.editedItem.associado.nome
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

    load() {
      console.log("inicio " + this.dataInicio);
      console.log("fim " + this.dataFim);

      API.getRelatorio(this.dataInicio, this.dataFim).then(response => {
        this.relatorio = response;
        console.dir("retornou " + this.relatorio);
      });
      this.pagination.totalItems = this.relatorio.length;
      this.pagination.rowsPerPage = this.relatorio.length;
    },

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

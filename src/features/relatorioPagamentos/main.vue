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
      <div ref="dataDiv">
        <v-data-table
          ref="datatable"
          id="datatable"
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
      </div>
    
          <v-btn  id="_csv"
                  fab
                  dark
                  large
                  right
                  absolute
                  color="green lighten"
                  @click="csvExport(csvData)"
          ><v-icon dark>print</v-icon></v-btn>

            <v-btn  id="_pdf"
                  fab
                  dark
                  large
                  right
                  absolute
                  color="red"
                  @click="pdfExport()"
          ><v-icon dark>print</v-icon></v-btn>

        
  </v-card>
  
  </div>

  
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    dataAtual: new Date().toISOString().substr(0, 10),
    buffer: [
      {
        dataPgto: "",
        cpf: "",
        nome: "",
        valorPago: "",
        formapgto: ""
      }
    ],
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
    relatorio: [],
    total: ""
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
    },
    csvData() {
      return this.relatorio.map(item => ({
        DataPgto: this.formatDate(item.dataPgto),
        Cpf: this.formatCPF(item.associado.cpf),
        Nome: item.associado.nome,
        Valor: item.valorPago,
        FormaPgto: item.formapgto
      }));
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

    formatCSVDate(date) {
      return moment(date).format("DD-MM-YYYY");
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
      const datatable = this.$refs.datatable;
      //console.log("table", datatable);
      return datatable
        ? datatable.filteredItems.reduce((s, i) => {
            this.total = s + parseFloat(i[column.value], 10);
            return s + parseFloat(i[column.value], 10);
          }, 0)
        : 0;
    },

    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(arrData[0]).join(";"),
        ...arrData.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute(
        "download",
        "relatorio_" + this.formatCSVDate(this.dataAtual) + ".csv"
      );
      link.click();
    },

    pdfExport() {
      let pdfName = "relatorio_" + this.formatCSVDate(this.dataAtual);

      var columns = [
        "Data do Pagamento",
        "CPF",
        "Nome",
        "Valor Pago",
        "Forma do Pagto"
      ];
      var rows = this.relatorio.map(function(data) {
        return [
          data.dataPgto,
          data.associado.cpf,
          data.associado.nome,
          data.valorPago,
          data.formapgto
        ];
      });

      // Only pt supported (not mm or in)
      var doc = new jsPDF("p", "pt");
      doc.setFontSize(11);

      doc.text(
        "Relatório de Pagamentos:    " +
          this.formatDate(this.dataInicio) +
          "  a  " +
          this.formatDate(this.dataFim),
        40,
        30
      );

      doc.text("Total: " + this.fixCurrency(this.total), 450, 30);

      doc.autoTable(columns, rows);
      doc.save(pdfName + ".pdf");
    },
    editItem(item) {
      this.editedIndex = this.relatorio.indexOf(item);
      this.buffer.dataPgto = this.formatDate(item.dataPgto);
      this.buffer.cpf = item.associado.cpf;
      this.buffer.nome = item.associado.nome;
      this.buffer.valorPago = item.associado.valorPago;
      this.buffer.formapgto = item.associado.formapgto;
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

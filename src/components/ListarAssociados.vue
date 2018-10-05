<template lang="html">
   <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Gerenciamento de Associados</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Novo</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.cpf" label="CPF"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.celular" label="Celular"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.email" label="E-Mail"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.valorAtual" label="Valor"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.vencAtual" label="Vencimento"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="associados"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
    >

      <template slot="items" slot-scope="props">
        <td>{{ props.item.cpf }}</td>
        <td class="text-xs-right">{{ props.item.nome }}</td>
        <td class="text-xs-right">{{ props.item.celular }}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
        <td class="text-xs-right">{{ props.item.valorAtual }}</td>
        <td class="text-xs-right">{{ props.item.vencAtual }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
  </div>

  
     <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

</div>
  
</template>

<script>
import API from "@/lib/API";
import axios from "../http-common";

export default {
  data: () => ({
    search: "",
    pagination: {rowsPerPage:5, totalItems:6},
    dialog: false,
    headers: [
      {
        text: "CPF",
        align: "left",
        sortable: true,
        value: "cpf"
      },
      { text: "Nome", value: "nome" },
      { text: "Celular", value: "celular" },
      { text: "E-Mail", value: "email" },
      { text: "Valor", value: "valorAtual" },
      { text: "Vencimento", value: "vencAtual", sortable: false }
    ],
    associados: [],
    editedIndex: -1,
    editedItem: {
      nome: "",
      celular: "",
      email: "",
      valorAtual: 0,
      vencAtual: 0
    },
    defaultItem: {
      nome: "",
      celular: "",
      email: "",
      valorAtual: 0,
      vencAtual: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Associado" : "Editar Associado";
    },
    pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    load() {
      API.getAssociados().then(associados => (this.associados = associados));
      this.pages();
    },

    initialize() {
      this.load();
    },

    editItem(item) {
      this.editedIndex = this.associados.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.associados.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.associados.splice(index, 1);

      console.log("Delete - Associado");
      axios.delete("/associado/" + item.cpf).then(response => {
        console.log(response);
      });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        console.log("Edit - Associado");

        axios
          .put("/associado/" + this.editedItem.cpf, {
            cpf: this.editedItem.cpf,
            nome: this.editedItem.nome,
            celular: this.editedItem.celular,
            email: this.editedItem.email,
            valorAtual: this.editedItem.valorAtual,
            vencAtual: this.editedItem.vencAtual
          })
          .then(response => {
            console.log(response);
          });

        Object.assign(this.associados[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Associado");

        axios
          .post("/associado", {
            cpf: this.editedItem.cpf,
            nome: this.editedItem.nome,
            celular: this.editedItem.celular,
            email: this.editedItem.email,
            valorAtual: this.editedItem.valorAtual,
            vencAtual: this.editedItem.vencAtual
          })
          .then(response => {
            console.log(response);
          });

        this.associados.push(this.editedItem);
      }
      this.close();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

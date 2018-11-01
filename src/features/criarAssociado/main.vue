<template>
<v-layout>
    <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
            v-model="cpf"
            label="CPF"
            required
            ></v-text-field>
            <v-text-field
            v-model="nome"
            :rules="nomeRules"
            :counter="100"
            label="Nome"
            required
            ></v-text-field>
            <v-text-field
            v-model="celular"
            label="Celular"
            required
            ></v-text-field>
            <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            ></v-text-field>
            <v-text-field
            v-model="valorAtual"
            label="Valor"
            required
            ></v-text-field>
            <v-text-field
            v-model="vencAtual"
            label="Vencimento"
            required
            ></v-text-field>
            

            <v-btn
            :disabled="!valid"
            @click="submit"
            >
            Confirmar
            </v-btn>
            <v-btn @click="clear">Limpar</v-btn>
        </v-form>    
     </v-flex>
</v-layout>
  
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";

export default {
  data: () => ({
    valid: true,
    nome: "",
    nomeRules: [
      v => !!v || "Informe o nome!",
      v =>
        (v && v.length <= 100) ||
        "O nome não deve ultrapassar o limite de caracteres"
    ],
    email: "",
    emailRules: [
      v => !!v || "Informe o e-mail!",
      v => /.+@.+../.test(v) || "O E-mail deve ser valido!"
    ]
  }),

  methods: {
    submit() {
      console.log("Create - Associado");
      confirm("Confirmar");

      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported

        confirm("validado");

        axios
          .post("/associado", {
            cpf: this.cpf,
            nome: this.nome,
            celular: this.celular,
            email: this.email,
            valorAtual: this.valorAtual,
            vencAtual: this.vencAtual
          })
          .then(response => {
            console.log(response);
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>
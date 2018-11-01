<template>
<v-layout>
    <v-flex xs8>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
            v-model="nome"
            :rules="nomeRules"
            :counter="100"
            label="Nome"
            required
            ></v-text-field>
            

            <v-btn
            :disabled="!valid"
            @click="submit"
            >
            Resetar senha padrão
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
  }),

  methods: {
    submit() {
      console.log("Reset de Senha");
      confirm("Confirmar Reset de Senha?");
      confirm(this.nome);
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported

        confirm("Sua senha foi resetada, verifique seu e-mail.");
        axios
          .get("/api/recuperarSenha/" + this.nome, {
            nome: this.nome
          
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
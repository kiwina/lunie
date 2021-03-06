<template>
  <SessionFrame>
    <TmFormStruct :submit="onSubmit.bind(this)">
      <h2 class="session-title">
        Choose password
      </h2>
      <div class="session-main bottom-indent">
        <Steps
          :steps="[`Recover`, `Name`, `Password`]"
          active-step="Password"
        />
        <TmFormGroup
          :error="$v.$error && $v.password.$invalid"
          field-id="import-password"
          field-label="Password"
        >
          <TmField
            id="import-password"
            v-model="password"
            type="password"
            placeholder="Must be at least 10 characters"
          />
          <TmFormMsg
            v-if="$v.password.$error && !$v.password.required"
            name="Password"
            type="required"
          />
          <TmFormMsg
            v-if="$v.password.$error && !$v.password.minLength"
            name="Password"
            type="minLength"
            min="10"
          />
        </TmFormGroup>
        <TmFormGroup
          :error="$v.$error && $v.passwordConfirm.$invalid"
          field-id="import-password-confirmation"
          field-label="Confirm Password"
        >
          <TmField
            id="import-password-confirmation"
            v-model="passwordConfirm"
            type="password"
            placeholder="Enter password again"
          />
          <TmFormMsg
            v-if="
              $v.passwordConfirm.$error && !$v.passwordConfirm.sameAsPassword
            "
            name="Password confirmation"
            type="match"
          />
          <TmFormMsg v-if="error" type="custom" :msg="errorMessage" />
        </TmFormGroup>
      </div>
      <div class="session-footer">
        <TmBtn value="Create" />
      </div>
    </TmFormStruct>
  </SessionFrame>
</template>

<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators"
import TmBtn from "common/TmBtn"
import TmFormGroup from "common/TmFormGroup"
import TmFormStruct from "common/TmFormStruct"
import TmField from "common/TmField"
import TmFormMsg from "common/TmFormMsg"
import SessionFrame from "common/SessionFrame"
import { mapState, mapGetters } from "vuex"
import Steps from "../../ActionModal/components/Steps"

export default {
  name: `session-import-password`,
  components: {
    TmBtn,
    TmField,
    SessionFrame,
    TmFormGroup,
    TmFormMsg,
    TmFormStruct,
    Steps,
  },
  data: () => ({
    error: false,
    errorMessage: ``,
  }),
  computed: {
    ...mapState([`recover`, `session`]),
    ...mapGetters([`network`, `networkSlug`, `isExtension`]),
    password: {
      get() {
        return this.$store.state.recover.password
      },
      set(value) {
        this.$store.commit(`updateField`, { field: `password`, value })
      },
    },
    passwordConfirm: {
      get() {
        return this.$store.state.recover.passwordConfirm
      },
      set(value) {
        this.$store.commit(`updateField`, { field: `passwordConfirm`, value })
      },
    },
  },
  beforeDestroy: function () {
    this.$store.dispatch(`resetRecoverData`)
  },
  methods: {
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$error) return
      try {
        await this.$store.dispatch(`createKey`, {
          seedPhrase: this.recover.seed,
          password: this.recover.password,
          name: this.recover.name,
          HDPath: this.session.HDPath,
          curve: this.session.curve,
          network: this.network,
        })
        if (this.isExtension) {
          this.$router.push(`/`)
        } else {
          this.$router.push({
            name: "portfolio",
            params: {
              networkId: this.networkSlug,
            },
          })
        }
      } catch (error) {
        this.error = true
        this.errorMessage = error.message
      }
    },
  },
  validations: () => ({
    password: { required, minLength: minLength(10) },
    passwordConfirm: { sameAsPassword: sameAs(`password`) },
  }),
}
</script>

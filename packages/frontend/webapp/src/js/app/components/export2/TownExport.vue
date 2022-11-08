<script>
import Checkbox from "#app/components/ui/Form/input/Checkbox";
import { getExports } from "#helpers/api/town";

export default {
  methods: {
    download() {
      getExports(this.shantytownId, this.options);
      this.$trackMatomoEvent(
        "Export",
        "Export fiche site",
        `S${this.shantytownId}`
      );
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

import { defineComponent } from "vue";
import YComment from "@/components/list/YComment.vue";
import { YTrackC } from "@/dual/YTrackC";
import { YColor } from "@/utils/color";
import { useStore } from "vuex";
import { type Theme1, type Theme2 } from "@/utils/theme";
import type { ICommentInfo } from "@/dual/YCommentC";

export default defineComponent({
  name: "YCommentView",
  components: {
    YComment,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    info: {
      type: Object as () => ICommentInfo,
      required: false,
    },
  },
  setup() {
    const store = useStore();
    return {
      setting: store.state.setting,
    };
  },
  watch: {
    id(newId) {
      this.track =
        this.type === "song" ? new YTrackC(newId) : new YTrackC(null);
      this.track.init();
      this.track.onTrackLoaded = async () => {
        await this.trackLoaded();
      };
    },
  },
  data() {
    return {
      track: this.type === "song" ? new YTrackC(this.id) : new YTrackC(null),
    };
  },
  methods: {
    openAlbum(id: number | string) {
      this.$router.push({ path: `/album/${id}` });
    },
    openArtist(id: number | string) {
      this.$router.push({ path: `/artist/${id}` });
    },
    openUser(id: number | string) {
      this.$router.push({ path: `/user/${id}` });
    },
    async trackLoaded() {
      try {
        let theme = YColor.findTheme(this.setting.display.theme);
        YColor.setBkColorFromImg(
          this.track.picUrl,
          document,
          (theme as Theme1).type,
          (theme as Theme2).background,
        );
      } catch (error) {
        console.error("YCommentView", error);
      }
    },
  },
  mounted() {
    this.track.init();
    this.track.onTrackLoaded = async () => {
      await this.trackLoaded();
    };
    if ((this.type === "album" || this.type === "playlist") && this.info) {
      try {
        let theme = YColor.findTheme(this.setting.display.theme);
        YColor.setBkColorFromImg(
          this.info.cover,
          document,
          (theme as Theme1).type,
          (theme as Theme2).background,
        );
      } catch (error) {
        console.error("YCommentView", error);
      }
    }
  },
});

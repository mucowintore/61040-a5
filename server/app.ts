import AuthenticatingConcept from "./concepts/authenticating";
import ExplainingConcept from "./concepts/explaining";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import RecordingConcept from "./concepts/recording";
import SessioningConcept from "./concepts/sessioning";
import TranscribingConcept from "./concepts/transcribing";
import TranslatingConcept from "./concepts/translating";
import UpvotingConcept from "./concepts/upvoting";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Upvoting = new UpvotingConcept("upvotes")
export const Translating = new TranslatingConcept("translations")
export const Transcribing = new TranscribingConcept("transcriptions")
export const Recording = new RecordingConcept('recordings')
export const Explaining = new ExplainingConcept('explanations')
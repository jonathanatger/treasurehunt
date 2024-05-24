import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowDown, ArrowUp, Check, Edit, X } from "lucide-react";
import {
  useContext,
  useRef,
  MutableRefObject,
  useState,
  useEffect,
  SetStateAction,
} from "react";
import { ObjectivesContext } from "./objectivesContext";
import { cn } from "~/lib/utils";

export function ProjectObjectivesComponent() {
  const objectives = useContext(ObjectivesContext)?.objectives;

  return (
    <>
      <div className="flex h-full flex-row md:w-full md:flex-col">
        {objectives &&
          objectives
            .sort((a, b) => {
              return a.order - b.order;
            })
            .map((objective, index) => (
              <ObjectiveCard
                key={"objective-card-" + objective.clientId.toString()}
                clientId={objective.clientId}
                title={objective.title}
                message={objective.message}
                index={index}
              />
            ))}
        {objectives?.length === 0 ? (
          <h3 className="m-1 rounded-3xl p-2 text-center text-zinc-400 outline outline-1 outline-zinc-400">
            Vous pouvez commencer à ajouter des objectifs sur la carte
          </h3>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

// change
function ObjectiveCard({
  clientId,
  title,
  message,
  index,
}: {
  clientId: number;
  title: string;
  message: string | null;
  index: number;
}) {
  const [clientMessage, setClientMessage] = useState<string | undefined>(
    undefined,
  );

  const contextData = useContext(ObjectivesContext);
  const markers = contextData?.markers;
  const markerContent = contextData?.markerContent;
  const switchObjectiveOrder = contextData?.switchObjectiveOrder;
  const deleteObjective = contextData?.deleteObjective;
  const cluesVisible = contextData?.cluesVisible;
  const [editingTitle, setEditingTitle] = useState<boolean>(false);

  function highlightMarker(isHighlighted: boolean) {
    const correspondingMarker = markers?.find(
      (marker) => marker.clientId === clientId,
    )?.marker;

    if (correspondingMarker === undefined || markerContent === undefined)
      return;
    correspondingMarker.content = markerContent(title, isHighlighted);
  }

  return (
    <Card
      className="flex h-full min-w-48 flex-row rounded-3xl shadow-lg md:mb-2 md:h-auto md:min-h-[160px] md:w-full md:min-w-60"
      onMouseEnter={() => highlightMarker(true)}
      onMouseLeave={() => highlightMarker(false)}
    >
      <div
        className={cn(
          "hidden max-h-[100%] w-12 flex-col items-center rounded-3xl md:flex",
          index === 0 ? " justify-end" : "justify-between",
        )}
      >
        <Button
          className={cn(
            "m-1 h-fit w-fit bg-transparent p-1",
            index === 0 ? "hidden" : "",
          )}
          onClick={() => {
            if (switchObjectiveOrder === undefined) return;
            highlightMarker(false);
            switchObjectiveOrder(clientId, -1);
          }}
        >
          <ArrowUp size={32} />
        </Button>
        <Button
          className="m-1 w-fit bg-transparent p-1"
          onClick={() => {
            if (switchObjectiveOrder === undefined) return;
            highlightMarker(false);
            switchObjectiveOrder(clientId, 1);
          }}
        >
          <ArrowDown size={32} />
        </Button>
      </div>
      <div
        className={cn(
          "flex h-full grow",
          cluesVisible
            ? " md:flex-row-reverse md:justify-between"
            : "flex flex-col justify-start",
        )}
      >
        <Button
          className={cn(
            "h-fit bg-transparent pt-1",
            cluesVisible ? "hidden md:flex" : "self-end",
          )}
          onClick={() => {
            if (deleteObjective === undefined) return;
            deleteObjective(clientId);
          }}
        >
          <X size={24} strokeWidth={2} />
        </Button>
        <div className="flex w-full grow flex-col items-start justify-start">
          <ObjectiveTitle
            cluesVisible={cluesVisible}
            title={title}
            clientId={clientId}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
          />
          {cluesVisible && (
            <ObjectiveClueMessageInput
              message={message}
              clientMessage={clientMessage}
              setClientMessage={setClientMessage}
              clientId={clientId}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function ObjectiveClueMessageInput({
  message,
  clientMessage,
  setClientMessage,
  clientId,
}: {
  message: string | null;
  clientMessage: string | undefined;
  setClientMessage: React.Dispatch<SetStateAction<string | undefined>>;
  clientId: number;
}) {
  useEffect(() => {
    if (message) setClientMessage(message);
  }, [message]);

  const cluesVisible = useContext(ObjectivesContext)?.cluesVisible;
  const changeClueMessage = useContext(ObjectivesContext)?.changeClueMessage;

  const debouncedTimeout: MutableRefObject<Timer | undefined> = useRef();

  function debouncedChangeClueMessageApiCall(_message: string) {
    clearTimeout(debouncedTimeout.current);

    if (changeClueMessage === undefined || clientMessage === undefined) return;
    debouncedTimeout.current = setTimeout(() => {
      changeClueMessage(clientId, _message);
    }, 3000);
  }

  function changeHeightOfTextArea() {
    const textAreaElement = document.getElementById(
      "clue-message-" + clientId.toString(),
    );
    if (textAreaElement === null) return;

    if (textAreaElement.scrollHeight < 150) {
      textAreaElement.style.height = `${textAreaElement.scrollHeight}px`;
    }
  }
  useEffect(() => {
    changeHeightOfTextArea();
  }, []);

  function changeHeightAndSetMessage(
    elem: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    changeHeightOfTextArea();
    setClientMessage(elem.target.value);
    debouncedChangeClueMessageApiCall(elem.target.value);
  }

  return (
    <div
      className={cn("flex h-full w-full flex-col items-start p-2 md:flex-row")}
    >
      <h4 className="text-light pr-2 pt-2 italic">Indice : </h4>
      <form className="h-full grow rounded-xl bg-background p-2 text-foreground">
        <textarea
          id={"clue-message-" + clientId.toString()}
          key={"clue-message-" + clientId.toString()}
          className="h-full w-full resize-none hyphens-auto text-wrap outline-none"
          placeholder="Vous devez trouver..."
          onChange={changeHeightAndSetMessage}
          value={clientMessage}
        ></textarea>
      </form>
    </div>
  );
}

function ObjectiveTitle({
  title,
  clientId,
  cluesVisible,
  editingTitle,
  setEditingTitle,
}: {
  title: string;
  clientId: number;
  cluesVisible: boolean | undefined;
  editingTitle: boolean;
  setEditingTitle: React.Dispatch<SetStateAction<boolean>>;
}) {
  const changeTitle = useContext(ObjectivesContext)?.changeTitleOfObjective;
  const objectives = useContext(ObjectivesContext)?.objectives;
  const [titleOnClient, setTitleOnClient] = useState(title);

  // update title of objectives UI component after data comes back from server
  useEffect(() => {
    if (objectives === undefined) return;

    const serverTitle = objectives.find(
      (obj) => obj.clientId === clientId,
    )?.title;
    if (serverTitle !== undefined) setTitleOnClient(serverTitle);
  }, [objectives]);

  // make sure the textarea grows with the text
  useEffect(() => {
    if (!editingTitle) return;
    const textarea = document.getElementById(
      "titleChangeBox-" + clientId.toString(),
    );
    if (textarea) textarea.style.height = `${textarea.scrollHeight}px`;
  }, [editingTitle]);

  function switchDisplay() {
    if (changeTitle === undefined) return;

    if (editingTitle) changeTitle(clientId, titleOnClient);
    setEditingTitle(!editingTitle);
  }

  return (
    <div
      className={cn("flex max-h-[100%] max-w-[100%] flex-col justify-start ")}
    >
      {editingTitle ? (
        <div
          className={cn(
            "flex max-w-[100%] flex-col px-2 py-2 font-title text-base font-bold md:text-xl",
            cluesVisible ? "flex-row space-x-2" : "flex-col space-y-2",
          )}
        >
          <textarea
            value={titleOnClient}
            onChange={(e) => {
              // e.target.style.height = `${e.target.scrollHeight}px`;
              setTitleOnClient(e.target.value);
            }}
            id={"titleChangeBox-" + clientId.toString()}
            className="h-6 w-[100%] resize-none text-wrap rounded-3xl bg-background px-4 font-normal text-foreground md:h-auto"
          />
          <Button onClick={switchDisplay} className="mb-2 h-6 bg-transparent">
            <Check onClick={switchDisplay} className="min-h-8" size={18} />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "mb-2 mr-2 flex cursor-pointer self-center px-4 py-2 font-title text-base font-bold hover:rounded-3xl hover:bg-secondary",
            "md:text-xl",
            cluesVisible
              ? "flex-row items-center space-x-4"
              : "flex-col items-start space-y-2",
          )}
          onClick={switchDisplay}
        >
          <h3 className="hyphens-auto">{titleOnClient}</h3>
        </div>
      )}
    </div>
  );
}

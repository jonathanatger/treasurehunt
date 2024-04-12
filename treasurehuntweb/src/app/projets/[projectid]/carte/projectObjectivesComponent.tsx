import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowDown, ArrowUp, CircleX, X } from "lucide-react";
import {
  useContext,
  useRef,
  MutableRefObject,
  useState,
  use,
  useEffect,
  SetStateAction,
} from "react";
import { ObjectivesContext } from "./page";
import { unescape } from "querystring";

export function ProjectObjectivesComponent() {
  const objectives = useContext(ObjectivesContext)?.objectives;

  return (
    <>
      <div className="flex w-full flex-col">
        {objectives &&
          objectives
            .sort((a, b) => {
              return a.order - b.order;
            })
            .map((objective) => (
              <ObjectiveCard
                key={"objective-card-" + objective.clientId.toString()}
                clientId={objective.clientId}
                title={objective.title}
                message={objective.message}
              />
            ))}
      </div>
    </>
  );
}

function ObjectiveCard({
  clientId,
  title,
  message,
}: {
  clientId: number;
  title: string;
  message: string;
}) {
  const [clientMessage, setClientMessage] = useState("");

  const contextData = useContext(ObjectivesContext);
  const markers = contextData?.markers;
  const markerContent = contextData?.markerContent;
  const switchObjectiveOrder = contextData?.switchObjectiveOrder;
  const deleteObjective = contextData?.deleteObjective;
  const cluesVisible = contextData?.cluesVisible;

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
      className="mb-2 flex min-h-[150px] w-full flex-row justify-between rounded-3xl shadow-lg"
      onMouseEnter={() => highlightMarker(true)}
      onMouseLeave={() => highlightMarker(false)}
    >
      <div className="flex w-12 flex-col items-center justify-between rounded-3xl bg-primary">
        <Button
          className="m-1 bg-transparent"
          onClick={() => {
            if (switchObjectiveOrder === undefined) return;
            highlightMarker(false);
            switchObjectiveOrder(clientId, -1);
          }}
        >
          <ArrowUp size={32} />
        </Button>
        <Button
          className="m-1 bg-transparent"
          onClick={() => {
            if (switchObjectiveOrder === undefined) return;
            highlightMarker(false);
            switchObjectiveOrder(clientId, 1);
          }}
        >
          <ArrowDown size={32} />
        </Button>
      </div>
      <div className="flex grow flex-col items-center">
        <div className="flex w-full flex-1 flex-row justify-between">
          <div className="self-center font-title text-xl font-bold">
            {title}
          </div>
          <Button
            className="bg-transparent"
            onClick={() => {
              if (deleteObjective === undefined) return;
              deleteObjective(clientId);
            }}
          >
            <X size={32} strokeWidth={2} />
          </Button>
        </div>
        {cluesVisible && (
          <ObjectiveClueMessageInput
            message={message}
            clientMessage={clientMessage}
            setClientMessage={setClientMessage}
            clientId={clientId}
          />
        )}
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
  message: string;
  clientMessage: string;
  setClientMessage: React.Dispatch<SetStateAction<string>>;
  clientId: number;
}) {
  // useEffect(() => {
  //   const textarea = document.getElementById(
  //     "clue-message-" + clientId.toString(),
  //   ) as HTMLTextAreaElement;
  //   if (!textarea) return;
  //   textarea.value = message;
  // }, [message]);

  const changeClueMessage = useContext(ObjectivesContext)?.changeClueMessage;

  const debouncedTimeout: MutableRefObject<
    string | number | NodeJS.Timeout | undefined
  > = useRef(0);

  function debouncedChangeClueMessage() {
    clearTimeout(debouncedTimeout.current);
    if (changeClueMessage === undefined) return;
    debouncedTimeout.current = setTimeout(() => {
      changeClueMessage(clientId, clientMessage);
    }, 3000);
  }

  function changeHeightAndSetMessage(elem: any) {
    elem.target.style.height = `${elem.target.scrollHeight}px`;
    setClientMessage(elem.target.value);
    debouncedChangeClueMessage();
  }

  return (
    <div className="flex w-full grow-[2] flex-col items-center">
      <div className="flex h-full w-full flex-row p-2 ">
        <h4 className="text-light pr-2 pt-2  italic">Indice : </h4>
        <form className="h-full grow rounded-3xl bg-background p-2 text-foreground">
          <textarea
            key={"clue-message-" + clientId.toString()}
            className="h-full min-h-24 w-full resize-none text-wrap bg-background outline-none"
            placeholder="Vous devez trouver la plus haute tour de la ville..."
            onInput={changeHeightAndSetMessage}
            value={clientMessage}
          ></textarea>
        </form>
      </div>
    </div>
  );
}

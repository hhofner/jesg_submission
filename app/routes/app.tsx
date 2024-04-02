import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button"
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import VerifierBlock from "~/components/VerifierBlock";
import VerificationStandardBlock from "~/components/VerificationStandardBlock";
import AssuranceLevelBlock from "~/components/AssuranceLevelBlock";
import ScopeVerificationBlock from "~/components/ScopeVerificationBlock";
import DisclosureInformationBlock from "~/components/DisclosureInformationBlock";
import { useEffect, useRef, useState } from "react";
import { getDb } from '../database.server.js'

export const meta: MetaFunction = () => {
  return [
    { title: "" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function getScore(questionType, scale) {
  if (scale === null) {
    return 0
  }
  var numberScaler = 0.6;
  if (questionType === 2) {
    numberScaler = 0.4
  }

  if (scale === "minimal") {
    return 0 * numberScaler;
  }
  if (scale === "developing") {
    return 2 * numberScaler;
  }
  if (scale === "robust") {
    return 3.5 * numberScaler;
  }
  if (scale === "exemplary") {
    return 5 * numberScaler;
  }
}

function ScoringDisplay({ scoring }: { scoring: string | null }) {
  return (
    <>
      {scoring === "minimal" ? <p className="text-4xl text-red-600">Minimal</p> : null}
      {scoring === "developing" ? <p className="text-4xl text-yellow-600">Developing</p> : null}
      {scoring === "robust" ? <p className="text-4xl text-lime-600">Robust</p> : null}
      {scoring === "exemplary" ? <p className="text-4xl text-emerald-600">Exemplary</p> : null}
      {scoring === null ? <p className="text-4xl">No score yet</p> : null}
    </>
  );
}

export async function loader() {
  const db = await getDb()
  const submissions = await db.all('SELECT * FROM submissions ORDER BY time_inputted DESC')
  await db.close()
  return json({ submissions })
}

export async function action({ request, }: ActionFunctionArgs) {
  const formData = await request.formData();

  const verifier = formData.get("verifier") as string;
  const verifierName = formData.get("verifier-name") as string;
  const verificationStandard = formData.getAll("verification-standard") as string[];
  const otherStandardText = formData.get("other-standard-text") as string;
  const assuranceLevel = formData.get("assurance-level") as string;
  const scopeVerification = formData.getAll("scope-verification") as string[];
  const disclosureInformationFile = formData.get("disclosure-info-file") as string;
  const disclosureInformationUrl = formData.get("disclosure-info-url") as string;
  const currentQ = formData.get("currentQ") as string;
  console.log("currentQ:", currentQ)

  // Error verification
  if (verifier === "option-yes" && verifierName === "") {
    return json({ errors: { verifierBlock: "Verifier name is required." } }, { status: 400 });
  }

  if (verificationStandard.includes("other-standard") && otherStandardText === "") {
    return json({ errors: { verificationStandardBlock: "Other verification standard text is required." } }, { status: 400 });
  }

  const assuranceLevelExists = !!assuranceLevel;
  const disclosureInformationExists = disclosureInformationFile !== "" || disclosureInformationUrl !== "";
  const scopeVerificationExists = scopeVerification.length > 0;

  var tempScoring = "minimal";

  if (verifier === "option-yes" && scopeVerificationExists && disclosureInformationExists) {
    tempScoring = "developing";
  }

  if (verifier === "option-yes" && assuranceLevelExists && scopeVerification.includes("scope-1") && disclosureInformationExists) {
    tempScoring = "robust";
  }

  if (verifier === "option-yes" && assuranceLevel === "option-reasonable" && scopeVerificationExists && disclosureInformationExists) {
    tempScoring = "exemplary";
  }

  const db = await getDb();
  const sql = `
    INSERT INTO submissions (
      verifier, verifier_name, verification_standard, 
      other_standard_text, assurance_level, scope_verification, 
      disclosure_info_file, disclosure_info_url, scoring
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    verifier, verifierName, JSON.stringify(verificationStandard),
    otherStandardText, assuranceLevel, JSON.stringify(scopeVerification),
    disclosureInformationFile, disclosureInformationUrl, tempScoring
  ];

  await db.run(sql, params);

  return json({ scoring: tempScoring, currentQ }, { status: 200 });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const formRef = useRef(null);
  const data = useLoaderData();
  const [viewBackend, setViewBackend] = useState(false);
  const [questionType, setQuestionType] = useState(1);
  const [currentQ, setCurrentQ] = useState(1);
  const [result1, setResult1] = useState(null)
  const [result2, setResult2] = useState(null)

  useEffect(() => {
    if (actionData?.scoring) {
      console.log(actionData)
      if (actionData?.currentQ === "1") {
        setResult1(actionData.scoring);
      } else if (actionData?.currentQ === "2") {
        setResult2(actionData.scoring);
      }
    }
  }, [actionData?.currentQ])

  console.log("result1", result1)
  console.log("result2", result2)

  useEffect(() => {
    const resetFormOnPageShow = () => {
      formRef.current.reset();
    };

    window.addEventListener('pageshow', resetFormOnPageShow);

    // Cleanup function
    return () => {
      window.removeEventListener('pageshow', resetFormOnPageShow);
    };
  }, []);  // Empty dependency array to run only on mount and unmount

  return (
    <div>
      <header className="border border-b-4 border-b-slate-100">
        <img src="/logo.webp" className="h-20" />
      </header>
      <main className="px-10 pt-4 flex gap-10">
        <Form method="post" ref={formRef} className={`grid w-full max-w-md items-center gap-6 border-r-2 border-r-slate-100 pr-8 ${currentQ >= 3 ? "opacity-35" : ""}`}>
          <div className="flex gap-4">
            <span className={currentQ === 1 ? "underline font-bold" : "text-slate-400"}>Question 1</span>
            <span className={currentQ === 2 ? "underline font-bold" : "text-slate-400"}>Question 2</span>
            <span className={currentQ >= 3 ? "underline font-bold" : "text-slate-400"}>Results →</span>
          </div>
          <VerifierBlock error={actionData?.errors?.verifierBlock} />
          <VerificationStandardBlock error={actionData?.errors?.verificationStandardBlock} />
          <AssuranceLevelBlock />
          <ScopeVerificationBlock />
          <DisclosureInformationBlock />
          <input className="hidden" value={currentQ-1} name="currentQ"/>
          {currentQ <= 2 ? <Button type="submit" onClick={() => setCurrentQ(currentQ + 1)}>
            { currentQ === 1 ? "Next Question" : currentQ === 2 ? "Submit" : ""}
          </Button> : null}
        </Form>
        <div className="px-8 w-full space-y-8">
          <h2 className="text-lg font-semibold underline">Results view</h2>
          <div>
            <h3 className="text-xl mb-2">Question (Scoring multiplier)</h3>
            <Button className="mr-2" onClick={() => setQuestionType(1)} variant={questionType === 1 ? "default" : "outline"}>Question 1</Button>
            <Button onClick={() => setQuestionType(2)} variant={questionType === 2 ? "default" : "outline"}>Question 2</Button>
          </div>
          <h2 className="text-2xl">Scoring Summary</h2>
          <h3 className="text-xl">Scale</h3>
          {actionData?.scoring ? <ScoringDisplay scoring={questionType === 1 ? result1 : result2} /> : null}
          <h3 className="text-xl">Score</h3>
          {actionData?.scoring ? <p className="text-2xl">{getScore(questionType, questionType === 1 ? result1 : result2)}</p> : null}

          <hr />
          <Button variant="outline" onClick={() => setViewBackend(!viewBackend)}>{!viewBackend ? "View" : "Hide"} previous submissions (database entries)</Button>
          {viewBackend ? <><h3 className="text-xl">Previous Submissions</h3>
          <div className="flex flex-col gap-4 text-sm max-w-4xl overflow-scroll max-h-40">
            {data.submissions.map((submission, index) => (
              <div key={index} className="flex gap-2">
                <p><span className="font-bold">Verifier:</span> {submission.verifier}</p>
                <p><span className="font-bold">Verifier Name:</span> {submission.verifier_name}</p>
                <p><span className="font-bold">Verification Standard:</span> {submission.verification_standard}</p>
                <p><span className="font-bold">Other Standard Text:</span> {submission.other_standard_text}</p>
                <p><span className="font-bold">Assurance Level:</span> {submission.assurance_level}</p>
                <p><span className="font-bold">Scope Verification:</span> {submission.scope_verification}</p>
                <p><span className="font-bold">Disclosure Information File:</span> {submission.disclosure_info_file}</p>
                <p><span className="font-bold">Disclosure Information URL:</span> {submission.disclosure_info_url}</p>
                <p><span className="font-bold">Time Inputted:</span> {new Date(submission.time_inputted).toLocaleString()}</p>
                <p><span className="font-bold">Scoring:</span> {submission.scoring}</p>
              </div>
            ))}
          </div></> : null}
        </div>
      </main>
    </div>
  );
}

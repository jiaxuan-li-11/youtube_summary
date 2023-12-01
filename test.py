from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
import requests

from flask import Flask, jsonify, render_template, request

videoID = 'AZMQVI6Ss64'
def run(videoID):
    print(videoID)

    # videoID = "Rh3tobg7hEo"
    transcript =  YouTubeTranscriptApi.get_transcript(videoID)
    print(transcript)
    print(len(transcript))
    text = []
    i=0
    temp = ''
    dp = []
    for data in transcript:
        print(data)
        if i<100:
            dp.append(data['start'])

        temp = temp+data['text'] + ' '
        i+=1
        if i==100:
            print(100)
            text.append(temp)
            temp = ''
            i=0

    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key="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",
    )

    print(len(text))

  # 对小区域的text进行总结，首先把文字送进gpt进行润色，防止转录错误。
  # start = 0
    # text_clean = []
    # for seg in text:

    #     prompt_txt1 = f"""
    #     Given paragraph: {seg}.

    #     Your tasks:
    #     A paragraph may consist of many sections; delete all line breaks and integrate the given sections into one complete paragraph.
    #     Fix the error in the given paragraph.
    #     If the first or last sentence is incomplete, leave them as they are without making any changes.
    #     Remove any repeating sentences, meaningless characters, not English sentences, and so on.
    #     Remove unnecessary repetition.
    #     Do not add more content information to the sentence on your own.
    #     Return directly the results without explanation.
    #     Return directly the input paragraph if it is already correct without explanation.
    #     If the final sentence is incomplete, please discard it.

    #     Input: Given paragraph
    #     Ouput: In a smooth and natural language format. Divide the completion result into reasonable paragraphs. A paragraph should end with a period.

    #     """
    #     response = client.completions.create(
    #         model="gpt-3.5-turbo-instruct",
    #         prompt = prompt_txt1,
    #         max_tokens = 2000
    #     )

    #     seg_clean = response.choices[0].text.strip()
    #     text_clean.append(seg_clean)

    text_clean = text
    t = 0
    result = []

    for i in range(len(text_clean)):
        print(i)
        prompt_txt2 = f"""
        Given pharagraph: {text_clean[i]}

        Please summarize the given paragraph in one sentence.
        Preserve important data and examples in sentences.
        Pay attention to the sentiment of the sentences.
        Use third-person perspective and maintain an objective tone as much as possible.
        Divide the summarization into separate sections where appropriate.
        Do not give any explaination.
        Do not include unnecessary line breaks.
        Do not add any instruction like 'Summary: '.
        """

        response2 = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt = prompt_txt2,
            max_tokens = 1000
        )

        summ = response2.choices[0].text.strip()
        s = {'start': dp[i], 'text': summ, 'url': 'https://www.youtube.com/watch?v='+videoID+'&t='+str(int(dp[i]))+'s'}
        result.append(s)

        # t = t+n
        print(s)
    return result

run(videoID)